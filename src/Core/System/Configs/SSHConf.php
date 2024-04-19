<?php
/*
 * MikoPBX - free phone system for small business
 * Copyright © 2017-2024 Alexey Portnov and Nikolay Beketov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

namespace MikoPBX\Core\System\Configs;


use MikoPBX\Common\Models\PbxSettings;
use MikoPBX\Common\Models\PbxSettingsConstants;
use MikoPBX\Core\System\MikoPBXConfig;
use MikoPBX\Core\System\Notifications;
use MikoPBX\Core\System\Processes;
use MikoPBX\Core\System\Util;
use MikoPBX\Core\Workers\WorkerPrepareAdvice;
use Phalcon\Di\Injectable;

/**
 * SSH Configuration Management Class.
 *
 * Manages SSH configurations including password setup, service restarts, and key management.
 *
 * @package MikoPBX\Core\System\Configs
 */
class SSHConf extends Injectable
{
    private MikoPBXConfig $mikoPBXConfig;

    /**
     * Constructor initializing MikoPBX configuration.
     */
    public function __construct()
    {
        $this->mikoPBXConfig = new MikoPBXConfig();
    }

    /**
     * Configures SSH settings based on current system settings.
     *
     * @return bool Returns true if configuration is successful, false otherwise.
     */
    public function configure(): bool
    {
        $lofFile = '/var/log/lastlog';
        if (!file_exists($lofFile)) {
            file_put_contents($lofFile, '');
        }
        $this->generateDropbearKeys();
        $sshLogin = $this->getSSHLogin();
        $sshPort = escapeshellcmd(PbxSettings::getValueByKey(PbxSettingsConstants::SSH_PORT));

        // Update root password and restart SSH server
        $this->updateShellPassword($sshLogin);

        // Killing existing Dropbear processes before restart
        Processes::killByName('dropbear');
        usleep(500000); // Delay to ensure process has stopped

        $sshPasswordDisabled = PbxSettings::getValueByKey(PbxSettingsConstants::SSH_DISABLE_SSH_PASSWORD) === '1';
        $options = $sshPasswordDisabled ? '-s' : '';
        $dropbear = Util::which('dropbear');
        $result = Processes::mwExec("$dropbear -p '$sshPort' $options -c /etc/rc/hello > /var/log/dropbear_start.log");

        $this->generateAuthorizedKeys($sshLogin);

        return ($result === 0);
    }

    /**
     * Generates or retrieves SSH keys, handling their storage and retrieval.
     *
     * @return void
     */
    private function generateDropbearKeys(): void
    {
        $keyTypes = [
            "rsa" => PbxSettingsConstants::SSH_RSA_KEY,
            "dss" => PbxSettingsConstants::SSH_DSS_KEY,
            "ecdsa" => PbxSettingsConstants::SSH_ECDSA_KEY,
            "ed25519" => PbxSettingsConstants::SSH_ED25519_KEY
        ];

        $dropBearDir = '/etc/dropbear';
        Util::mwMkdir($dropBearDir);

        $dropbearkey = Util::which('dropbearkey');
        // Get keys from DB
        foreach ($keyTypes as $keyType => $dbKey) {
            $resKeyFilePath = "{$dropBearDir}/dropbear_" . $keyType . "_host_key";
            $keyValue = trim(PbxSettings::getValueByKey($dbKey));
            if (strlen($keyValue) > 100) {
                file_put_contents($resKeyFilePath, base64_decode($keyValue));
            } elseif (!file_exists($resKeyFilePath)) {
                Processes::mwExec("$dropbearkey -t $keyType -f $resKeyFilePath");
                $newKey = base64_encode(file_get_contents($resKeyFilePath));
                $this->mikoPBXConfig->setGeneralSettings($dbKey, $newKey);
            }
        }

    }

    /**
     * Retrieves the designated SSH login username from settings.
     *
     * @return string SSH login username.
     */
    private function getSSHLogin(): string
    {
        $sshLogin = PbxSettings::getValueByKey(PbxSettingsConstants::SSH_LOGIN);
        $homeDir = $this->getUserHomeDir($sshLogin);
        $passwdPath = '/etc/passwd';
        $newEntry = "$sshLogin:x:0:0:MikoPBX Admin:$homeDir:/bin/bash\n";

        if ($sshLogin !== 'root') {
            // Read the current contents of the passwd file
            $passwdContent = file_get_contents($passwdPath);
            $lines = explode("\n", $passwdContent);
            $updated = false;

            // Check each line and update the entry if it exists
            foreach ($lines as &$line) {
                if (strpos($line, "$sshLogin:") === 0) {
                    $line = $newEntry;
                    $updated = true;
                    break;
                }
            }
            unset($line); // break the reference with the last element

            // If the entry was updated, rewrite the file
            if ($updated) {
                file_put_contents($passwdPath, implode("\n", $lines));
            } else {
                // Append the new entry if it wasn't found
                file_put_contents($passwdPath, $newEntry, FILE_APPEND);
            }
        }

        return $sshLogin;
    }

    /**
     * Retrieves or assigns the home directory for a specified username.
     *
     * @param string $sshLogin SSH login username.
     * @return string Home directory path.
     */
    private function getUserHomeDir(string $sshLogin = 'root'): string
    {
        $homeDir = ($sshLogin === 'root') ? '/root' : "/home/$sshLogin";
        Util::mwMkdir($homeDir);
        return $homeDir;
    }

    /**
     * Updates the shell password for specified SSH login.
     *
     * @param string $sshLogin SSH login username.
     * @return void
     */
    public function updateShellPassword(string $sshLogin = 'root'): void
    {
        $password = PbxSettings::getValueByKey(PbxSettingsConstants::SSH_PASSWORD);
        $hashString = PbxSettings::getValueByKey(PbxSettingsConstants::SSH_PASSWORD_HASH_STRING);
        $disablePassLogin = PbxSettings::getValueByKey(PbxSettingsConstants::SSH_DISABLE_SSH_PASSWORD);

        $echo = Util::which('echo');
        $chpasswd = Util::which('chpasswd');
        $passwd = Util::which('passwd');
        Processes::mwExec("{$passwd} -l www");
        if ($disablePassLogin === '1') {
            Processes::mwExec("$passwd -l $sshLogin");
        } else {
            Processes::mwExec("$echo '$sshLogin:$password' | $chpasswd");
        }

        // Security hash check and notification
        $currentHash = md5_file('/etc/shadow');
        $this->mikoPBXConfig->setGeneralSettings(PbxSettingsConstants::SSH_PASSWORD_HASH_FILE, $currentHash);
        if ($hashString !== md5($password)) {
            $this->mikoPBXConfig->setGeneralSettings(PbxSettingsConstants::SSH_PASSWORD_HASH_STRING, md5($password));
            Notifications::sendAdminNotification('adv_SSHPasswordWasChangedSubject', ['adv_SSHPasswordWasChangedBody'], true);
            WorkerPrepareAdvice::afterChangeSSHConf();
        }
    }

    /**
     * Generates and stores the authorized_keys based on database settings for a specified SSH login.
     *
     * @param string $sshLogin SSH login username.
     * @return void
     */
    public function generateAuthorizedKeys(string $sshLogin = 'root'): void
    {
        $homeDir = $this->getUserHomeDir($sshLogin);
        $sshDir = "$homeDir/.ssh";
        Util::mwMkdir($sshDir);

        $authorizedKeys = PbxSettings::getValueByKey(PbxSettingsConstants::SSH_AUTHORIZED_KEYS);
        file_put_contents("{$sshDir}/authorized_keys", $authorizedKeys);
    }
}