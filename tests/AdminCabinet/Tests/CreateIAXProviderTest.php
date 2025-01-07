<?php

namespace MikoPBX\Tests\AdminCabinet\Tests;

use MikoPBX\Tests\AdminCabinet\Lib\MikoPBXTestsBase;
use MikoPBX\Tests\AdminCabinet\Tests\Traits\LoginTrait;

/**
 * Base class for IAX provider creation tests
 */
abstract class CreateIAXProviderTest extends MikoPBXTestsBase
{
    use LoginTrait;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setSessionName("Test: Create IAX provider - " . $this->getIAXProviderData()['description']);
    }

    /**
     * Get IAX provider data
     */
    abstract protected function getIAXProviderData(): array;

    /**
     * Test creating IAX provider
     */
    public function testCreateIAXProvider(): void
    {
        $params = $this->getIAXProviderData();
        self::annotate("Creating IAX provider: {$params['description']}");

        try {
            $this->createIAXProvider($params);
            $this->verifyIAXProvider($params);
            self::annotate("Successfully created IAX provider: {$params['description']}", 'success');
        } catch (\Exception $e) {
            self::annotate("Failed to create IAX provider: {$params['description']}", 'error');
            throw $e;
        }
    }

    /**
     * Create IAX provider
     */
    protected function createIAXProvider(array $params): void
    {
        $this->clickSidebarMenuItemByHref('/admin-cabinet/providers/index/');
        $this->clickDeleteButtonOnRowWithText($params['description']);
        $this->clickButtonByHref('/admin-cabinet/providers/modifyiax');

        $this->fillBasicFields($params);
        $this->fillAdvancedOptions($params);

        $this->submitForm('save-provider-form');
    }

    /**
     * Fill basic provider fields
     */
    protected function fillBasicFields(array $params): void
    {
        // Fix uniqid
        self::$driver->executeScript(
            "$('#save-provider-form').form('set value','uniqid','{$params['uniqid']}');"
        );

        $this->changeInputField('description', $params['description']);
        $this->changeInputField('host', $params['host']);
        $this->changeInputField('username', $params['username']);
        $this->changeInputField('secret', $params['password']);
    }

    /**
     * Fill advanced options
     */
    protected function fillAdvancedOptions(array $params): void
    {
        $this->openAccordionOnThePage();

        $this->changeCheckBoxState('qualify', $params['qualify']);
        $this->changeCheckBoxState('noregister', $params['noregister']);
        $this->changeTextAreaValue('manualattributes', $params['manualattributes']);
    }

    /**
     * Verify IAX provider creation
     */
    protected function verifyIAXProvider(array $params): void
    {
        $this->clickSidebarMenuItemByHref('/admin-cabinet/providers/index/');
        $this->clickModifyButtonOnRowWithText($params['description']);

        $this->verifyBasicFields($params);
        $this->verifyAdvancedOptions($params);
    }

    /**
     * Verify basic provider fields
     */
    protected function verifyBasicFields(array $params): void
    {
        $this->assertInputFieldValueEqual('description', $params['description']);
        $this->assertInputFieldValueEqual('host', $params['host']);
        $this->assertInputFieldValueEqual('username', $params['username']);
        $this->assertInputFieldValueEqual('secret', $params['password']);
    }

    /**
     * Verify advanced options
     */
    protected function verifyAdvancedOptions(array $params): void
    {
        $this->openAccordionOnThePage();

        $this->assertCheckBoxStageIsEqual('qualify', $params['qualify']);
        $this->assertCheckBoxStageIsEqual('noregister', $params['noregister']);
        $this->assertTextAreaValueIsEqual('manualattributes', $params['manualattributes']);
    }
}
