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
 * Factory class for Outgoing Call Rules test data
 */
class OutgoingCallRulesDataFactory
{
    private static array $rulesData = [
        'local.calls' => [
            'rulename' => 'Local outgoing calls',
            'note' => 'Calls only at local landlines',
            'numberbeginswith' => '(7|8)',
            'restnumbers' => '10',
            'trimfrombegin' => '1',
            'prepend' => '8',
            'providerid' => 'SIP-PROVIDER-34F7CCFE873B9DABD91CC8D75342CB43',
            'providerName' => '',
            'type' => 'Local',
            'description' => 'Rule for handling local landline calls'
        ],
        'international.calls' => [
            'rulename' => 'International outgoing calls',
            'note' => 'Calls to everywhere',
            'numberbeginswith' => '00',
            'restnumbers' => '10',
            'trimfrombegin' => '2',
            'prepend' => '777',
            'providerid' => 'SIP-PROVIDER-34F7CCFE873B9DABD91CC8D75342CB43',
            'providerName' => '',
            'type' => 'International',
            'description' => 'Rule for handling international calls'
        ],
        'cti.test.1' => [
            'rulename' => 'Outgoing calls for CTI tests 1',
            'note' => '',
            'numberbeginswith' => '',
            'restnumbers' => '10',
            'trimfrombegin' => '0',
            'prepend' => '7',
            'providerid' => 'SIP-1683372744',
            'providerName' => 'Provider for CTI tests',
            'type' => 'Test',
            'description' => 'Basic CTI test rule'
        ],
        'cti.test.2' => [
            'rulename' => 'Outgoing calls for CTI tests 2',
            'note' => '1. The client calls in the company...',  // полная заметка опущена для краткости
            'numberbeginswith' => '(7|8)',
            'restnumbers' => '10',
            'trimfrombegin' => '0',
            'prepend' => '',
            'providerid' => 'SIP-1683372744',
            'providerName' => 'Provider for CTI tests',
            'type' => 'Test',
            'description' => 'Complex CTI test rule with IVR logic'
        ]
    ];

    public static function getRuleData(string $ruleKey): array
    {
        if (!isset(self::$rulesData[$ruleKey])) {
            throw new \RuntimeException("Outgoing call rule data not found for key: $ruleKey");
        }
        return self::$rulesData[$ruleKey];
    }

    public static function getAllRuleKeys(): array
    {
        return array_keys(self::$rulesData);
    }

    public static function getRulesByType(string $type): array
    {
        return array_filter(
            self::$rulesData,
            fn($data) => $data['type'] === $type
        );
    }
}