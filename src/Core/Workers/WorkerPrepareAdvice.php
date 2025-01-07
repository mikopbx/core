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

namespace MikoPBX\Core\Workers;

use MikoPBX\Common\Handlers\CriticalErrorsHandler;
use MikoPBX\Common\Models\AsteriskManagerUsers;
use MikoPBX\Common\Models\NetworkFilters;
use MikoPBX\Common\Models\PbxSettings;
use MikoPBX\Common\Models\Sip;
use MikoPBX\Common\Providers\ManagedCacheProvider;
use MikoPBX\Core\System\SystemMessages;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckAmiPasswords;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckConnection;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckCorruptedFiles;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckFirewalls;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckSIPPasswords;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckSSHConfig;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckSSHPasswords;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckStorage;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckUpdates;
use MikoPBX\Core\Workers\Libs\WorkerPrepareAdvice\CheckWebPasswords;
use Phalcon\Di\Di;
use Throwable;

require_once 'Globals.php';

/**
 * WorkerPrepareAdvice is a worker class responsible for preparing system advice.
 */
class WorkerPrepareAdvice extends WorkerBase
{
    public const array ARR_ADVICE_TYPES = [
        ['type' => CheckConnection::class, 'cacheTime' => 120],
        ['type' => CheckCorruptedFiles::class, 'cacheTime' => 3600],
        ['type' => CheckWebPasswords::class, 'cacheTime' => 864000],
        ['type' => CheckSSHPasswords::class, 'cacheTime' => 864000],
        ['type' => CheckFirewalls::class, 'cacheTime' => 864000],
        ['type' => CheckSIPPasswords::class, 'cacheTime' => 864000],
        ['type' => CheckAmiPasswords::class, 'cacheTime' => 864000],
        ['type' => CheckStorage::class, 'cacheTime' => 3600],
        ['type' => CheckUpdates::class, 'cacheTime' => 86400],
        ['type' => CheckSSHConfig::class, 'cacheTime' => 3600],
    ];

    // Array of generated advice
    public array $messages;

    /**
     * Cleans up cache for advice after changing any models.
     *
     * @param array $record Parameters of the event.
     * @return void
     */
    public static function afterModelEvents(array $record): void
    {
        SystemMessages::sysLogMsg(__METHOD__, "After models changes:" . PHP_EOL . json_encode($record, JSON_PRETTY_PRINT), LOG_DEBUG);
        $di = Di::getDefault();
        $managedCache = $di->getShared(ManagedCacheProvider::SERVICE_NAME);
        $cacheKeys = [];
        switch ($record['model']) {
            case PbxSettings::class:
                switch ($record['recordId']) {
                    case PbxSettings::SSH_PASSWORD_HASH_STRING:
                    case PbxSettings::SSH_PASSWORD:
                    case PbxSettings::SSH_PASSWORD_HASH_FILE:
                        $cacheKeys[self::getCacheKey(CheckSSHPasswords::class)] = true;
                        $cacheKeys[self::getCacheKey(CheckSSHConfig::class)] = true;
                        break;
                    case PbxSettings::WEB_ADMIN_PASSWORD:
                        $cacheKeys[self::getCacheKey(CheckWebPasswords::class)] = true;
                        break;
                    case PbxSettings::PBX_FIREWALL_ENABLED:
                        $cacheKeys[self::getCacheKey(CheckFirewalls::class)] = true;
                        break;
                    default:
                }
                break;
            case AsteriskManagerUsers::class:
                $cacheKeys[self::getCacheKey(CheckAmiPasswords::class)] = true;
                break;
            case Sip::class:
                $cacheKeys[self::getCacheKey(CheckSIPPasswords::class)] = true;
                break;
            case NetworkFilters::class:
                $cacheKeys[self::getCacheKey(CheckFirewalls::class)] = true;
                break;
            default:
        }
        SystemMessages::sysLogMsg(__METHOD__, "Cleanup the next caches:" . PHP_EOL . json_encode($cacheKeys, JSON_PRETTY_PRINT), LOG_DEBUG);
        foreach ($cacheKeys as $cacheKey => $value) {
            $managedCache->delete($cacheKey);
        }
    }

    /**
     * Starts processing advice types.
     *
     * @param array $argv The command-line arguments passed to the worker.
     *
     * @throws Throwable
     */
    public function start(array $argv): void
    {
        $adviceTypes = self::ARR_ADVICE_TYPES;

        // Asynchronously process each advice type using pcntl_fork
        foreach ($adviceTypes as $adviceType) {
            $pid = pcntl_fork();
            if ($pid == -1) {
                // Error during fork.
                throw new \RuntimeException("Failed to fork process");
            } elseif ($pid == 0) {
                // Child process.
                try {
                    $this->setForked();
                    $this->processAdvice($adviceType);
                } catch (Throwable $e) {
                    CriticalErrorsHandler::handleExceptionWithSyslog($e);
                }
                exit(0); // Exit the child process.
            }
            // Parent process continues the loop.
        }

        // Optionally, wait for all child processes to finish.
        while (pcntl_waitpid(0, $status) != -1) {
            // You can process the status if needed.
        }
    }

    /**
     * Processes advice of a specific type and caches the result.
     *
     * @param array $adviceType An array containing advice type and cache time.
     */
    private function processAdvice(array $adviceType): void
    {
        $start = microtime(true);
        $managedCache = $this->getDI()->getShared(ManagedCacheProvider::SERVICE_NAME);
        $currentAdviceClass = $adviceType['type'];
        $cacheKey = self::getCacheKey($currentAdviceClass);
        if (!$managedCache->has($cacheKey)) {
            // No cache - generate advice and store in cache
            try {
                $checkObj = new $currentAdviceClass();
                $newAdvice = $checkObj->process();
                $managedCache->set($cacheKey, $newAdvice, $adviceType['cacheTime']);
            } catch (Throwable $e) {
                CriticalErrorsHandler::handleExceptionWithSyslog($e);
            }
            $timeElapsedSecs = round(microtime(true) - $start, 2);
            if ($timeElapsedSecs > 5) {
                SystemMessages::sysLogMsg(
                    __METHOD__,
                    "WARNING: Service WorkerPrepareAdvice:{$adviceType['type']} processed more than $timeElapsedSecs seconds",
                    LOG_WARNING
                );
            }
        }
    }

    /**
     * Prepares a cache key for an advice type.
     *
     * @param string $currentAdviceType Current advice type.
     * @return string Cache key.
     */
    public static function getCacheKey(string $currentAdviceType): string
    {
        return 'WorkerPrepareAdvice:' . $currentAdviceType;
    }
}

// Start a worker process
WorkerPrepareAdvice::startWorker($argv ?? []);
