"use strict";

/*
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 8 2020
 */

/* global ace, PbxApi */
var updateLogViewWorker = {
  timeOut: 3000,
  timeOutHandle: '',
  errorCounts: 0,
  initialize: function () {
    function initialize() {
      updateLogViewWorker.restartWorker();
    }

    return initialize;
  }(),
  restartWorker: function () {
    function restartWorker() {
      window.clearTimeout(updateLogViewWorker.timeoutHandle);
      updateLogViewWorker.worker();
    }

    return restartWorker;
  }(),
  worker: function () {
    function worker() {
      var data = systemDiagnosticLogs.$formObj.form('get values');
      PbxApi.SyslogGetLogFromFile(data.filename, data.filter, data.lines, systemDiagnosticLogs.cbUpdateLogText);
      updateLogViewWorker.timeoutHandle = window.setTimeout(updateLogViewWorker.worker, updateLogViewWorker.timeOut);
    }

    return worker;
  }(),
  stop: function () {
    function stop() {
      window.clearTimeout(updateLogViewWorker.timeoutHandle);
    }

    return stop;
  }()
};
var systemDiagnosticLogs = {
  $showBtn: $('#show-last-log'),
  $downloadBtn: $('#download-file'),
  $showAutoBtn: $('#show-last-log-auto'),
  viewer: '',
  $fileSelectDropDown: $('#system-diagnostic-form .filenames-select'),
  logsItems: [],
  defaultLogItem: null,
  $formObj: $('#system-diagnostic-form'),
  $fileName: $('#system-diagnostic-form .filename'),
  initialize: function () {
    function initialize() {
      systemDiagnosticLogs.initializeAce();
      PbxApi.SyslogGetLogsList(systemDiagnosticLogs.cbFormatDropdownResults);
      systemDiagnosticLogs.$showBtn.on('click', function (e) {
        e.preventDefault();
        var data = systemDiagnosticLogs.$formObj.form('get values');
        PbxApi.SyslogGetLogFromFile(data.filename, data.filter, data.lines, systemDiagnosticLogs.cbUpdateLogText);
      });
      systemDiagnosticLogs.$downloadBtn.on('click', function (e) {
        e.preventDefault();
        var data = systemDiagnosticLogs.$formObj.form('get values');
        PbxApi.SyslogDownloadLogFile(data.filename, systemDiagnosticLogs.cbDownloadFile);
      });
      systemDiagnosticLogs.$showAutoBtn.on('click', function (e) {
        e.preventDefault();
        var $reloadIcon = systemDiagnosticLogs.$showAutoBtn.find('i.refresh');

        if ($reloadIcon.hasClass('loading')) {
          $reloadIcon.removeClass('loading');
          updateLogViewWorker.stop();
        } else {
          $reloadIcon.addClass('loading');
          updateLogViewWorker.initialize();
        }
      });
    }

    return initialize;
  }(),
  initializeAce: function () {
    function initializeAce() {
      var aceHeight = window.innerHeight - 300;
      var rowsCount = Math.round(aceHeight / 16.3);
      $(window).load(function () {
        $('.log-content-readonly').css('min-height', "".concat(aceHeight, "px"));
      });

      var IniMode = ace.require('ace/mode/julia').Mode;

      systemDiagnosticLogs.viewer = ace.edit('log-content-readonly');
      systemDiagnosticLogs.viewer.session.setMode(new IniMode());
      systemDiagnosticLogs.viewer.setTheme('ace/theme/monokai');
      systemDiagnosticLogs.viewer.resize();
      systemDiagnosticLogs.viewer.renderer.setShowGutter(false);
      systemDiagnosticLogs.viewer.setOptions({
        showLineNumbers: false,
        showPrintMargin: false,
        readOnly: true,
        maxLines: rowsCount
      });
    }

    return initializeAce;
  }(),

  /**
   * Makes formatted menu structure
   */
  cbFormatDropdownResults: function () {
    function cbFormatDropdownResults(response) {
      if (response === false) {
        return;
      }

      systemDiagnosticLogs.logsItems = [];
      var files = response.files;
      $.each(files, function (index, item) {
        systemDiagnosticLogs.logsItems.push({
          name: "".concat(index, " (").concat(item.size, ")"),
          value: item.path,
          selected: item["default"]
        });
      });
      systemDiagnosticLogs.$fileSelectDropDown.dropdown({
        values: systemDiagnosticLogs.logsItems,
        onChange: systemDiagnosticLogs.cbOnChangeFile,
        ignoreCase: true,
        fullTextSearch: true,
        forceSelection: false
      });
    }

    return cbFormatDropdownResults;
  }(),

  /**
   * Callback after change log file in select
   * @param value
   */
  cbOnChangeFile: function () {
    function cbOnChangeFile(value) {
      if (value.length === 0) {
        return;
      }

      systemDiagnosticLogs.$formObj.form('set value', 'filename', value);
      var data = systemDiagnosticLogs.$formObj.form('get values');
      PbxApi.SyslogGetLogFromFile(data.filename, data.filter, data.lines, systemDiagnosticLogs.cbUpdateLogText);
    }

    return cbOnChangeFile;
  }(),

  /**
   * Updates log view
   * @param data
   */
  cbUpdateLogText: function () {
    function cbUpdateLogText(data) {
      systemDiagnosticLogs.viewer.getSession().setValue(data.content);
      var row = systemDiagnosticLogs.viewer.session.getLength() - 1;
      var column = systemDiagnosticLogs.viewer.session.getLine(row).length; // or simply Infinity

      systemDiagnosticLogs.viewer.gotoLine(row + 1, column);
    }

    return cbUpdateLogText;
  }(),

  /**
   * After push button download file
   * @param response
   */
  cbDownloadFile: function () {
    function cbDownloadFile(response) {
      if (response !== false) {
        window.location = response.filename;
      }
    }

    return cbDownloadFile;
  }()
};
$(document).ready(function () {
  systemDiagnosticLogs.initialize();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TeXN0ZW1EaWFnbm9zdGljL3N5c3RlbS1kaWFnbm9zdGljLWluZGV4LXNob3dsb2dzLmpzIl0sIm5hbWVzIjpbInVwZGF0ZUxvZ1ZpZXdXb3JrZXIiLCJ0aW1lT3V0IiwidGltZU91dEhhbmRsZSIsImVycm9yQ291bnRzIiwiaW5pdGlhbGl6ZSIsInJlc3RhcnRXb3JrZXIiLCJ3aW5kb3ciLCJjbGVhclRpbWVvdXQiLCJ0aW1lb3V0SGFuZGxlIiwid29ya2VyIiwiZGF0YSIsInN5c3RlbURpYWdub3N0aWNMb2dzIiwiJGZvcm1PYmoiLCJmb3JtIiwiUGJ4QXBpIiwiU3lzbG9nR2V0TG9nRnJvbUZpbGUiLCJmaWxlbmFtZSIsImZpbHRlciIsImxpbmVzIiwiY2JVcGRhdGVMb2dUZXh0Iiwic2V0VGltZW91dCIsInN0b3AiLCIkc2hvd0J0biIsIiQiLCIkZG93bmxvYWRCdG4iLCIkc2hvd0F1dG9CdG4iLCJ2aWV3ZXIiLCIkZmlsZVNlbGVjdERyb3BEb3duIiwibG9nc0l0ZW1zIiwiZGVmYXVsdExvZ0l0ZW0iLCIkZmlsZU5hbWUiLCJpbml0aWFsaXplQWNlIiwiU3lzbG9nR2V0TG9nc0xpc3QiLCJjYkZvcm1hdERyb3Bkb3duUmVzdWx0cyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiU3lzbG9nRG93bmxvYWRMb2dGaWxlIiwiY2JEb3dubG9hZEZpbGUiLCIkcmVsb2FkSWNvbiIsImZpbmQiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJhY2VIZWlnaHQiLCJpbm5lckhlaWdodCIsInJvd3NDb3VudCIsIk1hdGgiLCJyb3VuZCIsImxvYWQiLCJjc3MiLCJJbmlNb2RlIiwiYWNlIiwicmVxdWlyZSIsIk1vZGUiLCJlZGl0Iiwic2Vzc2lvbiIsInNldE1vZGUiLCJzZXRUaGVtZSIsInJlc2l6ZSIsInJlbmRlcmVyIiwic2V0U2hvd0d1dHRlciIsInNldE9wdGlvbnMiLCJzaG93TGluZU51bWJlcnMiLCJzaG93UHJpbnRNYXJnaW4iLCJyZWFkT25seSIsIm1heExpbmVzIiwicmVzcG9uc2UiLCJmaWxlcyIsImVhY2giLCJpbmRleCIsIml0ZW0iLCJwdXNoIiwibmFtZSIsInNpemUiLCJ2YWx1ZSIsInBhdGgiLCJzZWxlY3RlZCIsImRyb3Bkb3duIiwidmFsdWVzIiwib25DaGFuZ2UiLCJjYk9uQ2hhbmdlRmlsZSIsImlnbm9yZUNhc2UiLCJmdWxsVGV4dFNlYXJjaCIsImZvcmNlU2VsZWN0aW9uIiwibGVuZ3RoIiwiZ2V0U2Vzc2lvbiIsInNldFZhbHVlIiwiY29udGVudCIsInJvdyIsImdldExlbmd0aCIsImNvbHVtbiIsImdldExpbmUiLCJnb3RvTGluZSIsImxvY2F0aW9uIiwiZG9jdW1lbnQiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQU1BO0FBR0EsSUFBTUEsbUJBQW1CLEdBQUc7QUFDM0JDLEVBQUFBLE9BQU8sRUFBRSxJQURrQjtBQUUzQkMsRUFBQUEsYUFBYSxFQUFFLEVBRlk7QUFHM0JDLEVBQUFBLFdBQVcsRUFBRSxDQUhjO0FBSTNCQyxFQUFBQSxVQUoyQjtBQUFBLDBCQUlkO0FBQ1pKLE1BQUFBLG1CQUFtQixDQUFDSyxhQUFwQjtBQUNBOztBQU4wQjtBQUFBO0FBTzNCQSxFQUFBQSxhQVAyQjtBQUFBLDZCQU9YO0FBQ2ZDLE1BQUFBLE1BQU0sQ0FBQ0MsWUFBUCxDQUFvQlAsbUJBQW1CLENBQUNRLGFBQXhDO0FBQ0FSLE1BQUFBLG1CQUFtQixDQUFDUyxNQUFwQjtBQUNBOztBQVYwQjtBQUFBO0FBVzNCQSxFQUFBQSxNQVgyQjtBQUFBLHNCQVdsQjtBQUNSLFVBQU1DLElBQUksR0FBR0Msb0JBQW9CLENBQUNDLFFBQXJCLENBQThCQyxJQUE5QixDQUFtQyxZQUFuQyxDQUFiO0FBQ0FDLE1BQUFBLE1BQU0sQ0FBQ0Msb0JBQVAsQ0FBNEJMLElBQUksQ0FBQ00sUUFBakMsRUFBMkNOLElBQUksQ0FBQ08sTUFBaEQsRUFBd0RQLElBQUksQ0FBQ1EsS0FBN0QsRUFBb0VQLG9CQUFv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LCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IMKpIE1JS08gTExDIC0gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICogVW5hdXRob3JpemVkIGNvcHlpbmcgb2YgdGhpcyBmaWxlLCB2aWEgYW55IG1lZGl1bSBpcyBzdHJpY3RseSBwcm9oaWJpdGVkXG4gKiBQcm9wcmlldGFyeSBhbmQgY29uZmlkZW50aWFsXG4gKiBXcml0dGVuIGJ5IEFsZXhleSBQb3J0bm92LCA4IDIwMjBcbiAqL1xuLyogZ2xvYmFsIGFjZSwgUGJ4QXBpICovXG5cblxuY29uc3QgdXBkYXRlTG9nVmlld1dvcmtlciA9IHtcblx0dGltZU91dDogMzAwMCxcblx0dGltZU91dEhhbmRsZTogJycsXG5cdGVycm9yQ291bnRzOiAwLFxuXHRpbml0aWFsaXplKCkge1xuXHRcdHVwZGF0ZUxvZ1ZpZXdXb3JrZXIucmVzdGFydFdvcmtlcigpO1xuXHR9LFxuXHRyZXN0YXJ0V29ya2VyKCkge1xuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodXBkYXRlTG9nVmlld1dvcmtlci50aW1lb3V0SGFuZGxlKTtcblx0XHR1cGRhdGVMb2dWaWV3V29ya2VyLndvcmtlcigpO1xuXHR9LFxuXHR3b3JrZXIoKSB7XG5cdFx0Y29uc3QgZGF0YSA9IHN5c3RlbURpYWdub3N0aWNMb2dzLiRmb3JtT2JqLmZvcm0oJ2dldCB2YWx1ZXMnKTtcblx0XHRQYnhBcGkuU3lzbG9nR2V0TG9nRnJvbUZpbGUoZGF0YS5maWxlbmFtZSwgZGF0YS5maWx0ZXIsIGRhdGEubGluZXMsIHN5c3RlbURpYWdub3N0aWNMb2dzLmNiVXBkYXRlTG9nVGV4dCk7XG5cdFx0dXBkYXRlTG9nVmlld1dvcmtlci50aW1lb3V0SGFuZGxlID0gd2luZG93LnNldFRpbWVvdXQoXG5cdFx0XHR1cGRhdGVMb2dWaWV3V29ya2VyLndvcmtlcixcblx0XHRcdHVwZGF0ZUxvZ1ZpZXdXb3JrZXIudGltZU91dCxcblx0XHQpO1xuXHR9LFxuXHRzdG9wKCkge1xuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodXBkYXRlTG9nVmlld1dvcmtlci50aW1lb3V0SGFuZGxlKTtcblx0fVxufTtcblxuY29uc3Qgc3lzdGVtRGlhZ25vc3RpY0xvZ3MgPSB7XG5cdCRzaG93QnRuOiAkKCcjc2hvdy1sYXN0LWxvZycpLFxuXHQkZG93bmxvYWRCdG46ICQoJyNkb3dubG9hZC1maWxlJyksXG5cdCRzaG93QXV0b0J0bjogJCgnI3Nob3ctbGFzdC1sb2ctYXV0bycpLFxuXHR2aWV3ZXI6ICcnLFxuXHQkZmlsZVNlbGVjdERyb3BEb3duOiAkKCcjc3lzdGVtLWRpYWdub3N0aWMtZm9ybSAuZmlsZW5hbWVzLXNlbGVjdCcpLFxuXHRsb2dzSXRlbXM6IFtdLFxuXHRkZWZhdWx0TG9nSXRlbTogbnVsbCxcblx0JGZvcm1PYmo6ICQoJyNzeXN0ZW0tZGlhZ25vc3RpYy1mb3JtJyksXG5cdCRmaWxlTmFtZTogJCgnI3N5c3RlbS1kaWFnbm9zdGljLWZvcm0gLmZpbGVuYW1lJyksXG5cdGluaXRpYWxpemUoKSB7XG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3MuaW5pdGlhbGl6ZUFjZSgpO1xuXHRcdFBieEFwaS5TeXNsb2dHZXRMb2dzTGlzdChzeXN0ZW1EaWFnbm9zdGljTG9ncy5jYkZvcm1hdERyb3Bkb3duUmVzdWx0cyk7XG5cblx0XHRzeXN0ZW1EaWFnbm9zdGljTG9ncy4kc2hvd0J0bi5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y29uc3QgZGF0YSA9IHN5c3RlbURpYWdub3N0aWNMb2dzLiRmb3JtT2JqLmZvcm0oJ2dldCB2YWx1ZXMnKTtcblx0XHRcdFBieEFwaS5TeXNsb2dHZXRMb2dGcm9tRmlsZShkYXRhLmZpbGVuYW1lLCBkYXRhLmZpbHRlciwgZGF0YS5saW5lcywgc3lzdGVtRGlhZ25vc3RpY0xvZ3MuY2JVcGRhdGVMb2dUZXh0KTtcblx0XHR9KTtcblxuXHRcdHN5c3RlbURpYWdub3N0aWNMb2dzLiRkb3dubG9hZEJ0bi5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y29uc3QgZGF0YSA9IHN5c3RlbURpYWdub3N0aWNMb2dzLiRmb3JtT2JqLmZvcm0oJ2dldCB2YWx1ZXMnKTtcblx0XHRcdFBieEFwaS5TeXNsb2dEb3dubG9hZExvZ0ZpbGUoZGF0YS5maWxlbmFtZSwgc3lzdGVtRGlhZ25vc3RpY0xvZ3MuY2JEb3dubG9hZEZpbGUpO1xuXHRcdH0pO1xuXG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3MuJHNob3dBdXRvQnRuLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjb25zdCAkcmVsb2FkSWNvbiA9IHN5c3RlbURpYWdub3N0aWNMb2dzLiRzaG93QXV0b0J0bi5maW5kKCdpLnJlZnJlc2gnKTtcblx0XHRcdGlmICgkcmVsb2FkSWNvbi5oYXNDbGFzcygnbG9hZGluZycpKXtcblx0XHRcdFx0JHJlbG9hZEljb24ucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHRcdFx0dXBkYXRlTG9nVmlld1dvcmtlci5zdG9wKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmVsb2FkSWNvbi5hZGRDbGFzcygnbG9hZGluZycpO1xuXHRcdFx0XHR1cGRhdGVMb2dWaWV3V29ya2VyLmluaXRpYWxpemUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0aW5pdGlhbGl6ZUFjZSgpIHtcblx0XHRjb25zdCBhY2VIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQtMzAwO1xuXHRcdGNvbnN0IHJvd3NDb3VudCA9IE1hdGgucm91bmQoYWNlSGVpZ2h0LzE2LjMpO1xuXHRcdCQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmxvZy1jb250ZW50LXJlYWRvbmx5JykuY3NzKCdtaW4taGVpZ2h0JywgYCR7YWNlSGVpZ2h0fXB4YCk7XG5cdFx0fSk7XG5cdFx0Y29uc3QgSW5pTW9kZSA9IGFjZS5yZXF1aXJlKCdhY2UvbW9kZS9qdWxpYScpLk1vZGU7XG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3Mudmlld2VyID0gYWNlLmVkaXQoJ2xvZy1jb250ZW50LXJlYWRvbmx5Jyk7XG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3Mudmlld2VyLnNlc3Npb24uc2V0TW9kZShuZXcgSW5pTW9kZSgpKTtcblx0XHRzeXN0ZW1EaWFnbm9zdGljTG9ncy52aWV3ZXIuc2V0VGhlbWUoJ2FjZS90aGVtZS9tb25va2FpJyk7XG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3Mudmlld2VyLnJlc2l6ZSgpO1xuXHRcdHN5c3RlbURpYWdub3N0aWNMb2dzLnZpZXdlci5yZW5kZXJlci5zZXRTaG93R3V0dGVyKGZhbHNlKTtcblx0XHRzeXN0ZW1EaWFnbm9zdGljTG9ncy52aWV3ZXIuc2V0T3B0aW9ucyh7XG5cdFx0XHQgc2hvd0xpbmVOdW1iZXJzOmZhbHNlLFxuXHRcdFx0IHNob3dQcmludE1hcmdpbjogZmFsc2UsXG5cdFx0XHQgcmVhZE9ubHk6IHRydWUsXG5cdFx0XHQgbWF4TGluZXM6IHJvd3NDb3VudCxcblx0XHQgfSk7XG5cdH0sXG5cdC8qKlxuXHQgKiBNYWtlcyBmb3JtYXR0ZWQgbWVudSBzdHJ1Y3R1cmVcblx0ICovXG5cdGNiRm9ybWF0RHJvcGRvd25SZXN1bHRzKHJlc3BvbnNlKSB7XG5cdFx0aWYgKHJlc3BvbnNlID09PWZhbHNlKXtcblx0XHRcdHJldHVybiA7XG5cdFx0fVxuXHRcdHN5c3RlbURpYWdub3N0aWNMb2dzLmxvZ3NJdGVtcyA9IFtdO1xuXHRcdGNvbnN0IGZpbGVzID0gcmVzcG9uc2UuZmlsZXM7XG5cdFx0JC5lYWNoKGZpbGVzLCAoaW5kZXgsIGl0ZW0pID0+IHtcblx0XHRcdHN5c3RlbURpYWdub3N0aWNMb2dzLmxvZ3NJdGVtcy5wdXNoKHtcblx0XHRcdFx0bmFtZTogYCR7aW5kZXh9ICgke2l0ZW0uc2l6ZX0pYCxcblx0XHRcdFx0dmFsdWU6IGl0ZW0ucGF0aCxcblx0XHRcdFx0c2VsZWN0ZWQ6IGl0ZW0uZGVmYXVsdFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3MuJGZpbGVTZWxlY3REcm9wRG93bi5kcm9wZG93bihcblx0XHRcdHtcblx0XHRcdFx0dmFsdWVzOiBzeXN0ZW1EaWFnbm9zdGljTG9ncy5sb2dzSXRlbXMsXG5cdFx0XHRcdG9uQ2hhbmdlOiBzeXN0ZW1EaWFnbm9zdGljTG9ncy5jYk9uQ2hhbmdlRmlsZSxcblx0XHRcdFx0aWdub3JlQ2FzZTogdHJ1ZSxcblx0XHRcdFx0ZnVsbFRleHRTZWFyY2g6IHRydWUsXG5cdFx0XHRcdGZvcmNlU2VsZWN0aW9uOiBmYWxzZSxcblx0XHRcdH1cblx0XHQpO1xuXHR9LFxuXHQvKipcblx0ICogQ2FsbGJhY2sgYWZ0ZXIgY2hhbmdlIGxvZyBmaWxlIGluIHNlbGVjdFxuXHQgKiBAcGFyYW0gdmFsdWVcblx0ICovXG5cdGNiT25DaGFuZ2VGaWxlKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlLmxlbmd0aD09PTApe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRzeXN0ZW1EaWFnbm9zdGljTG9ncy4kZm9ybU9iai5mb3JtKCdzZXQgdmFsdWUnLCAnZmlsZW5hbWUnLCB2YWx1ZSk7XG5cdFx0Y29uc3QgZGF0YSA9IHN5c3RlbURpYWdub3N0aWNMb2dzLiRmb3JtT2JqLmZvcm0oJ2dldCB2YWx1ZXMnKTtcblx0XHRQYnhBcGkuU3lzbG9nR2V0TG9nRnJvbUZpbGUoZGF0YS5maWxlbmFtZSwgZGF0YS5maWx0ZXIsIGRhdGEubGluZXMsIHN5c3RlbURpYWdub3N0aWNMb2dzLmNiVXBkYXRlTG9nVGV4dCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBVcGRhdGVzIGxvZyB2aWV3XG5cdCAqIEBwYXJhbSBkYXRhXG5cdCAqL1xuXHRjYlVwZGF0ZUxvZ1RleHQoZGF0YSkge1xuXHRcdHN5c3RlbURpYWdub3N0aWNMb2dzLnZpZXdlci5nZXRTZXNzaW9uKCkuc2V0VmFsdWUoZGF0YS5jb250ZW50KTtcblx0XHRjb25zdCByb3cgPSBzeXN0ZW1EaWFnbm9zdGljTG9ncy52aWV3ZXIuc2Vzc2lvbi5nZXRMZW5ndGgoKSAtIDE7XG5cdFx0Y29uc3QgY29sdW1uID0gc3lzdGVtRGlhZ25vc3RpY0xvZ3Mudmlld2VyLnNlc3Npb24uZ2V0TGluZShyb3cpLmxlbmd0aDsgLy8gb3Igc2ltcGx5IEluZmluaXR5XG5cdFx0c3lzdGVtRGlhZ25vc3RpY0xvZ3Mudmlld2VyLmdvdG9MaW5lKHJvdyArIDEsIGNvbHVtbik7XG5cdH0sXG5cdC8qKlxuXHQgKiBBZnRlciBwdXNoIGJ1dHRvbiBkb3dubG9hZCBmaWxlXG5cdCAqIEBwYXJhbSByZXNwb25zZVxuXHQgKi9cblx0Y2JEb3dubG9hZEZpbGUocmVzcG9uc2Upe1xuXHRcdGlmIChyZXNwb25zZSE9PWZhbHNlKXtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHJlc3BvbnNlLmZpbGVuYW1lO1xuXHRcdH1cblx0fVxufTtcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXHRzeXN0ZW1EaWFnbm9zdGljTG9ncy5pbml0aWFsaXplKCk7XG59KTtcblxuIl19