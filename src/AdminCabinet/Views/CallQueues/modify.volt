{{ form('call-queues/save', 'role': 'form', 'class': 'ui large form','id':'queue-form') }}
{{ form.render('id') }}
{{ form.render('uniqid') }}
<div class="ui ribbon label" id="queue-extension-number">
    <i class="phone icon"></i> {{ extension }}
</div>
<h3 class="ui dividing header ">{{ t._("cq_QueueSetup") }}</h3>
<div class="wide field">
    <label>{{ t._('cq_Name') }}</label>
    <div class="twelve wide field">
        {{ form.render('name') }}
    </div>
</div>

<div class="field">
    <label>{{ t._('cq_Description') }}</label>
    <div class="twelve wide field">
        {{ form.render('description') }}
    </div>
</div>

<h3 class="ui dividing header ">{{ t._("cq_QueueMembers") }}</h3>
<div class="field">
    <label>{{ t._('cq_SelectAgentForAddToQueue') }}</label>
<div class="six wide field">
    <div class="ui selection dropdown search" id="extensionselect">
        <div class="default text">{{ t._('ex_SelectNumber') }}</div>
        <i class="dropdown icon"></i>
    </div>
</div>
</div>
<div class="ui basic compact segment">
    <table class="ui selectable small very compact unstackable table" id="extensionsTable">
        <tbody>
        {% for extension in extensionsTable %}
            <tr class="member-row" id="{{ extension['number'] }}">
                <td class="dragHandle"><i class="sort grey icon"></i></td>
                <td class="callerid">{{ extension['callerid'] }}</td>
                <td class="right aligned collapsing">
                    <div class="ui icon small button delete-row-button"><i class="icon trash red"></i></div>
                </td>
            </tr>
        {% endfor %}
        <tr class="member-row-tpl" style="display: none">
            <td class="dragHandle"><i class="sort grey icon"></i></td>
            <td class="callerid"></td>
            <td class="right aligned collapsing">
                <div class="ui icon small button delete-row-button"><i class="icon trash red"></i></div>
            </td>
        </tr>
        </tbody>
    </table>
</div>

<div class="field">
    <label>{{ t._('cq_QueueStrategy') }}</label>
    {{ form.render('strategy') }}
</div>

{{ partial("PbxExtensionModules/hookVoltBlock",['arrayOfPartials':hookVoltBlock('MainFields')]) }}

<div class="ui accordion field">
    <div class=" title">
        <i class="icon dropdown"></i>
        {{ t._('AdvancedOptions') }}
    </div>

    <div class="content">
        <div class="field">
            <label>{{ t._('cd_Extensions') }}</label>
            <div class="six wide field">
                <div class="ui icon input extension">
                    <i class="search icon"></i>
                    {{ form.render('extension') }}
                </div>
                <div class="ui top pointing red label hidden" id="extension-error">
                    {{ t._("cq_ThisNumberIsNotFree") }}
                </div>
            </div>
        </div>

        <div class="field">
            <label>{{ t._('cq_CallerIDPrefix') }}</label>
            <div class="six wide field">
                {{ form.render('callerid_prefix') }}
            </div>
        </div>

        <div class="ui hidden divider"></div>
        <h3 class="ui dividing header ">{{ t._("cq_QueueMemberSettings") }}</h3>

        <div class="inline field">
            {{ form.render('seconds_to_ring_each_member') }}
            <label>{{ t._('cq_SecRingToEachMembers') }}</label>

        </div>

        <div class="inline field">
            {{ form.render('seconds_for_wrapup') }}
            <label>{{ t._('cq_WrapupTime') }}</label>
        </div>

        <div class="field">
            <div class="ui toggle checkbox">
                {{ form.render('recive_calls_while_on_a_call') }}
                <label>{{ t._('cq_ReciveCallWhileOnCall') }}</label>
            </div>
        </div>

        <div class="ui hidden divider"></div>
        <h3 class="ui dividing header ">{{ t._("cq_QueueCallerSettings") }}</h3>


        <div class="inline field">
            <label>{{ t._('cq_CallerHearOnQueued') }}</label>
            {{ form.render('caller_hear') }}
        </div>
        {{ partial("partials/playAddNewSound", ['label': t._('cq_PereodicAnonceMohSoundFile'), 'id':'moh_sound_id', 'fieldClass':'eleven wide field', 'fieldId':'']) }}

        <div class="field">
            <div class="ui toggle checkbox">
                {{ form.render('announce_position') }}
                <label>{{ t._('cq_AnnoncePosition') }}</label>
            </div>
        </div>

        <div class="field">
            <div class="ui toggle checkbox">
                <label>{{ t._('cq_AnnonceHoldTime') }}</label>
                {{ form.render('announce_hold_time') }}

            </div>
        </div>

        {{ partial("partials/playAddNewSound", ['label': t._('cq_PereodicAnonceSoundFile'), 'id':'periodic_announce_sound_id', 'fieldClass':'eleven wide field', 'fieldId':'']) }}

        <div class="inline field">
            {{ form.render('periodic_announce_frequency') }}
            <label>{{ t._('cq_PereodicAnonceFrequency') }}</label>
        </div>

        <div class="ui hidden divider"></div>
        <h3 class="ui dividing header ">{{ t._("cq_CallRouting") }}</h3>

        <div class="ui segment">
            <h4 class="ui header">{{ t._("cq_ScenaryOne") }}</h4>

            <div class="inline field">
                {{ t._("cq_IfQueueNotAnsweredFor") }}
                {{ form.render('timeout_to_redirect_to_extension') }}
                {{ t._("cq_SecondsCallWillBeRoutedTo") }}
                {{ form.render('timeout_extension') }}
            </div>

        </div>

        <div class="ui segment">
            <h4 class="ui header">{{ t._("cq_ScenaryTwo") }}</h4>

            <div class="inline field">
                {{ t._("cq_RedirectToExtensionIfEmtyQueue") }}
                {{ form.render('redirect_to_extension_if_empty') }}
            </div>

        </div>

        {{ partial("PbxExtensionModules/hookVoltBlock",['arrayOfPartials':hookVoltBlock('AdvancedFields')]) }}

    </div>
</div>

{{ partial("partials/submitbutton",['indexurl':'call-queues/index/']) }}

{{ end_form() }}