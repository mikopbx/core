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

namespace MikoPBX\Tests\AdminCabinet\Tests\Data;

/**
 * Factory class for employee test data
 */
class EmployeeDataFactory
{
    /**
     * Employee data storage
     * @var array
     */
    private static array $employeeData = [
        'eugeniy.makrchev' => [
            'number' => 235,
            'email' => 'emar@miko.ru',
            'username' => 'Eugeniy Makrchev',
            'mobile' => '79031454088',
            'secret' => '23542354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '[endpoint]
callerid=2546456<240>',
        ],
        'nikolay.beketov' => [
            'number' => 229,
            'email' => 'nuberk@miko.ru',
            'username' => 'Nikolay Beketov',
            'mobile' => '79265244743',
            'secret' => 'GAb2o%2B_1Ys.25',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'inband',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'svetlana.vlasova' => [
            'number' => 223,
            'email' => 'svlassvlas@miko.ru',
            'username' => 'Svetlana Vlasova',
            'mobile' => '79269900372',
            'secret' => 'GAb2o%qwerqwer2354235.25',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'info',
            'sip_networkfilterid' => '4',
            'sip_transport' => 'tcp',
            'sip_manualattributes' => '',
        ],
        'natalia.beketova' => [
            'number' => 217,
            'email' => 'nanabek@miko.ru',
            'username' => 'Natalia Beketova',
            'mobile' => '79265244843',
            'secret' => 'GAb2o%2B_1Ys.25',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '',
        ],
        'julia.efimova' => [
            'number' => 206,
            'email' => 'bubuh@miko.ru',
            'username' => 'Julia Efimova',
            'mobile' => '79851417827',
            'secret' => '23542354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'rfc4733',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'alisher.usmanov' => [
            'number' => 231,
            'email' => 'alish@miko.ru',
            'username' => 'Alisher Usmanov',
            'mobile' => '79265639989',
            'secret' => '23542354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '',
        ],
        'ivan.maltsev' => [
            'number' => 236,
            'email' => 'imalll@miko.ru',
            'username' => 'Ivan Maltsev',
            'mobile' => '79265679989',
            'secret' => '23542354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'alexandr.medvedev' => [
            'number' => 214,
            'email' => 'alex@miko.ru',
            'username' => 'Alexandr Medvedev',
            'mobile' => '79853059396',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'anna.mzhelskaya' => [
            'number' => 212,
            'email' => 'amzh@miko.ru',
            'username' => 'Anna Mzhelskaya',
            'mobile' => '79852888742',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'viktor.mitin' => [
            'number' => 210,
            'email' => 'vmit@miko.ru',
            'username' => 'Viktor Mitin',
            'mobile' => '79251323617',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'anton.pasutin' => [
            'number' => 228,
            'email' => 'apas@miko.ru',
            'username' => 'Anton Pasutin',
            'mobile' => '79262321957',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'kristina.perfileva' => [
            'number' => 213,
            'email' => 'kper@miko.ru',
            'username' => 'Kristina Perfileva',
            'mobile' => '79256112214',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'alexey.portnov' => [
            'number' => 204,
            'email' => 'apore@miko.ru',
            'username' => 'Alexey Portnov',
            'mobile' => '79257184255',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'tatiana.portnova' => [
            'number' => 233,
            'email' => 'tpora@miko.ru',
            'username' => 'Tatiana Portnova',
            'mobile' => '79606567153',
            'secret' => '235RTWETt543re42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'alexandra.pushina' => [
            'number' => 254,
            'email' => 'apushh@miko.ru',
            'username' => 'Alexandra Pushina',
            'mobile' => '74952293043',
            'secret' => '235RTWETtre5442354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
            'possibleToDelete' => true
        ],
        'dmitri.fomichev' => [
            'number' => 253,
            'email' => 'dfom@miko.ru',
            'username' => 'Dmitri Fomichev',
            'mobile' => '79152824438',
            'secret' => '235RTWETerwtre42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'daria.holodova' => [
            'number' => 230,
            'email' => 'dhol@miko.ru',
            'username' => 'Daria Holodova',
            'mobile' => '79161737472',
            'secret' => '235RTWETtre42354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '',
        ],
        'ilia.tsvetkov' => [
            'number' => 219,
            'email' => 'icvetf@miko.ru',
            'username' => 'Ilia Tsvetkov',
            'mobile' => '79998201098',
            'secret' => '235RT34WETtre42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '[endpoint]
callerid=2546456<240>',
        ],
        'maxim.tsvetkov' => [
            'number' => 240,
            'email' => 'mcvetfd@miko.ru',
            'username' => 'Maxim Tsvetkov',
            'mobile' => '79055651617',
            'secret' => '235RTWETttre42354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '[endpoint]
callerid=2546456<240>',
        ],
        'viktor.chentcov' => [
            'number' => 251,
            'email' => 'vchen@miko.ru',
            'username' => 'Viktor Chentcov',
            'mobile' => '79265775288',
            'secret' => '235RTrWETtre42354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '[endpoint]
callerid=2546456<251>',
        ],
        'evgenia.chulkova' => [
            'number' => 234,
            'email' => 'esam@miko.ru',
            'username' => 'Evgenia Chulkova',
            'mobile' => '79161237145',
            'secret' => '235RTWETftre42354wet',
            'sip_enableRecording' => true,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'tls',
            'sip_manualattributes' => '[endpoint]
callerid=2546456<234>',
        ],
        'nikita.telegrafov' => [
            'number' => 246,
            'email' => 'ntele@miko.ru',
            'username' => 'Nikita Telegrafov',
            'mobile' => '79051454089',
            'secret' => '23542354wet',
            'sip_enableRecording' => false,
            'sip_dtmfmode' => 'auto_info',
            'sip_networkfilterid' => 'none',
            'sip_transport' => 'udp',
            'sip_manualattributes' => '',
        ],
        'alexandra.pushina.289' => [
                'number'   => 289,
                'email'    => 'mask@miko.ru',
                'username' => 'Alexandra Pushina',
                'mobile'   => '79123125410',
                'secret'   => '23542354wet2',
                'sip_dtmfmode' => 'inband',
                'sip_networkfilterid' => '4',
                'fwd_ringlength' => '30',
                'fwd_forwardingonbusy' => '203',
                'fwd_forwarding' => '89251111111',
                'fwd_forwardingonunavailable' => '201',
                'manualattributes' => '[endpoint]
callerid=2546456<235>',
        ],
        'smith.james' => [
            'number'   => 201,
            'username' => 'Smith James',
            'mobile'   => '89261111111',
            'secret'   => '5b66b92d5714f921cfcde78a4fda0f58',
            'possibleToDelete' => false
        ]
    ];

    /**
     * Get employee data by key
     *
     * @param string $employeeKey Employee identifier
     * @return array Employee data
     * @throws \RuntimeException If employee data not found
     */
    public static function getEmployeeData(string $employeeKey): array
    {
        if (!isset(self::$employeeData[$employeeKey])) {
            throw new \RuntimeException("Employee data not found for key: $employeeKey");
        }
        return self::$employeeData[$employeeKey];
    }

    /**
     * Get all employee keys
     *
     * @return array List of employee keys
     */
    public static function getAllEmployeeKeys(): array
    {
        return array_keys(self::$employeeData);
    }

    /**
     * Get all employee data
     *
     * @return array All employee data
     */
    public static function getAllEmployeeData(): array
    {
        return self::$employeeData;
    }
}