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

namespace MikoPBX\Core\System\CloudProvisioning;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use MikoPBX\Core\System\SystemMessages;

class DigitalOceanCloud extends CloudProvider
{
    public const string CloudID = 'DigitalOceanCloud';

    /**
     * Base URL for DigitalOcean metadata service
     */
    private const string METADATA_BASE_URL = 'http://169.254.169.254/metadata/v1/';

    private Client $client;

    public function __construct()
    {
        $this->client = new Client(['timeout' => self::HTTP_TIMEOUT]);
    }

    /**
     * Performs the DigitalOcean cloud provisioning using the Metadata Service.
     *
     * @return bool True if the provisioning was successful, false otherwise.
     */
    public function provision(): bool
    {
        // Check if we're running on DigitalOcean using vendor data analysis
        if (!$this->isDigitalOceanCloud()) {
            return false;
        }

        // Get droplet ID as unique identifier
        $dropletId = $this->getMetadata('id');
        if (empty($dropletId)) {
            return false;
        }

        SystemMessages::echoToTeletype(PHP_EOL);

        // Update machine name with DO hostname
        $hostname = $this->getMetadata('hostname');
        $this->updateHostName($hostname);

        // Get external IP address (check reserved IP first, then fallback to anchor IP)
        $extIp = $this->getExternalIP();
        $this->updateLanSettings($extIp);

        // Update SSH keys
        $sshKeys = $this->getMetadata('public-keys');
        $this->updateSSHKeys($sshKeys);

        // Update SSH and web credentials using droplet ID
        $this->updateSSHCredentials('do-user', $dropletId);
        $this->updateWebPassword($dropletId);

        return true;
    }

    /**
     * Checks if we're running on DigitalOcean by analyzing vendor data
     *
     * @return bool True if running on DigitalOcean, false otherwise
     */
    private function isDigitalOceanCloud(): bool
    {
        $vendorData = $this->getMetadata('vendor-data');

        // Check for multiple DigitalOcean-specific patterns in vendor data
        $doPatterns = [
            'DigitalOcean resolver',
            'DNS=67.207.67.',  // DigitalOcean DNS servers pattern
            'logger -t DigitalOcean'
        ];

        foreach ($doPatterns as $pattern) {
            if (str_contains($vendorData, $pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the external IP address, prioritizing reserved IP if available
     *
     * @return string The external IP address
     */
    private function getExternalIP(): string
    {
        // Check for reserved IP first
        $reservedIpActive = $this->getMetadata('reserved_ip/ipv4/active');
        if ($reservedIpActive === 'true') {
            $reservedIp = $this->getMetadata('reserved_ip/ipv4/ip_address');
            if (!empty($reservedIp)) {
                return $reservedIp;
            }
        }

        // Fallback to anchor IP
        return $this->getMetadata('interfaces/public/0/anchor_ipv4/address');
    }

    /**
     * Retrieves metadata from the DigitalOcean Metadata service.
     *
     * @param string $path The metadata path to retrieve
     *
     * @return string The response content or empty string on failure
     */
    private function getMetadata(string $path): string
    {
        try {
            $response = $this->client->request('GET', self::METADATA_BASE_URL . $path, [
                'timeout' => self::HTTP_TIMEOUT,
                'http_errors' => false,
            ]);

            if ($response->getStatusCode() === 200) {
                return trim($response->getBody()->getContents());
            }
        } catch (GuzzleException $e) {
            SystemMessages::sysLogMsg(
                __CLASS__,
                "Failed to retrieve DO metadata for path '$path': " . $e->getMessage()
            );
        }

        return '';
    }
}