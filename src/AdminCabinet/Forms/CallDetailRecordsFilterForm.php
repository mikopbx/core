<?php
/*
 * MikoPBX - free phone system for small business
 * Copyright (C) 2017-2020 Alexey Portnov and Nikolay Beketov
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

namespace MikoPBX\AdminCabinet\Forms;

use Phalcon\Forms\Element\Text;

/**
 * Class CallDetailRecordsFilterForm
 *
 * @package MikoPBX\AdminCabinet\Forms
 * @property \MikoPBX\Common\Providers\TranslationProvider translation
 */
class CallDetailRecordsFilterForm extends BaseForm
{

    public function initialize(/** @scrutinizer ignore-unused */ $entity = null, $options = null): void
    {
        parent::initialize($entity, $options);

        $this->add(
            new Text(
                'extension',
                ['value' => $options['extension']]
            )
        );
        $this->add(
            new Text(
                'date_from',
                ['value' => $options['date_from']]
            )
        );
        $this->add(new Text('date_to', ['value' => $options['date_to']]));
    }
}