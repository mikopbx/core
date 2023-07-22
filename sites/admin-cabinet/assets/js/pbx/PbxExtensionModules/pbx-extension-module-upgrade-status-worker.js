"use strict";

/*
 * MikoPBX - free phone system for small business
 * Copyright © 2017-2023 Alexey Portnov and Nikolay Beketov
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

/* global globalRootUrl, PbxApi, globalTranslate, UserMessage, installStatusLoopWorker */

/**
 * Monitors the status of module upgrade.
 *
 * @module upgradeStatusLoopWorker
 */
var upgradeStatusLoopWorker = {
  /**
   * Time in milliseconds before fetching new status request.
   * @type {number}
   */
  timeOut: 1000,

  /**
   * The id of the timer function for the status worker.
   * @type {number}
   */
  timeOutHandle: 0,

  /**
   * The unique ID of the module.
   * @type {string}
   */
  moduleUniqid: '',

  /**
   * The number of iterations.
   * @type {number}
   */
  iterations: 0,

  /**
   * The old progress percentage.
   * @type {string}
   */
  oldPercent: '0',

  /**
   * Initializes the module upgrade status.
   * @param {string} uniqid - The unique ID of the module.
   */
  initialize: function initialize(uniqid) {
    upgradeStatusLoopWorker.moduleUniqid = uniqid;
    upgradeStatusLoopWorker.iterations = 0;
    upgradeStatusLoopWorker.restartWorker();
  },

  /**
   * Restarts the upgrade status worker.
   */
  restartWorker: function restartWorker() {
    window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
    upgradeStatusLoopWorker.worker();
  },

  /**
   * The worker function that checks the module upgrade status.
   */
  worker: function worker() {
    window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
    PbxApi.ModulesModuleDownloadStatus(upgradeStatusLoopWorker.moduleUniqid, upgradeStatusLoopWorker.cbRefreshModuleStatus, upgradeStatusLoopWorker.restartWorker);
  },

  /**
   * Callback function to refresh the module upgrade status.
   * @param {object} response - The response from the server.
   */
  cbRefreshModuleStatus: function cbRefreshModuleStatus(response) {
    upgradeStatusLoopWorker.iterations += 1;
    upgradeStatusLoopWorker.timeoutHandle = window.setTimeout(upgradeStatusLoopWorker.worker, upgradeStatusLoopWorker.timeOut); // Check download status

    if (response === false && upgradeStatusLoopWorker.iterations < 50) {
      window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
    } else if (upgradeStatusLoopWorker.iterations > 50 || response.d_status === 'PROGRESS_FILE_NOT_FOUND' || response.d_status === 'NOT_FOUND') {
      window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
      var errorMessage = response.d_error !== undefined ? response.d_error : '';
      errorMessage = errorMessage.replace(/\n/g, '<br>');
      UserMessage.showMultiString(errorMessage, globalTranslate.ext_UpdateModuleError);
      $("#".concat(upgradeStatusLoopWorker.moduleUniqid)).find('i').removeClass('loading');
      $('.new-module-row').find('i').addClass('download').removeClass('redo');
      $('a.button').removeClass('disabled');
    } else if (response.d_status === 'DOWNLOAD_IN_PROGRESS') {
      if (upgradeStatusLoopWorker.oldPercent !== response.d_status_progress) {
        upgradeStatusLoopWorker.iterations = 0;
      }

      $('i.loading.redo').closest('a').find('.percent').text("".concat(response.d_status_progress, "%"));
      upgradeStatusLoopWorker.oldPercent = response.d_status_progress;
    } else if (response.d_status === 'DOWNLOAD_COMPLETE') {
      $('i.loading.redo').closest('a').find('.percent').text('100%');
      PbxApi.ModulesInstallModule(response.filePath, upgradeStatusLoopWorker.cbAfterModuleInstall);
      window.clearTimeout(upgradeStatusLoopWorker.timeoutHandle);
    }
  },

  /**
   * Callback function after installing the module.
   * @param {object} response - The response from the server.
   */
  cbAfterModuleInstall: function cbAfterModuleInstall(response) {
    if (response.result === true && response.data.filePath !== '') {
      installStatusLoopWorker.initialize(response.data.filePath, response.data.moduleWasEnabled);
    } else {
      UserMessage.showMultiString(response, globalTranslate.ext_InstallationError);
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9QYnhFeHRlbnNpb25Nb2R1bGVzL3BieC1leHRlbnNpb24tbW9kdWxlLXVwZ3JhZGUtc3RhdHVzLXdvcmtlci5qcyJdLCJuYW1lcyI6WyJ1cGdyYWRlU3RhdHVzTG9vcFdvcmtlciIsInRpbWVPdXQiLCJ0aW1lT3V0SGFuZGxlIiwibW9kdWxlVW5pcWlkIiwiaXRlcmF0aW9ucyIsIm9sZFBlcmNlbnQiLCJpbml0aWFsaXplIiwidW5pcWlkIiwicmVzdGFydFdvcmtlciIsIndpbmRvdyIsImNsZWFyVGltZW91dCIsInRpbWVvdXRIYW5kbGUiLCJ3b3JrZXIiLCJQYnhBcGkiLCJNb2R1bGVzTW9kdWxlRG93bmxvYWRTdGF0dXMiLCJjYlJlZnJlc2hNb2R1bGVTdGF0dXMiLCJyZXNwb25zZSIsInNldFRpbWVvdXQiLCJkX3N0YXR1cyIsImVycm9yTWVzc2FnZSIsImRfZXJyb3IiLCJ1bmRlZmluZWQiLCJyZXBsYWNlIiwiVXNlck1lc3NhZ2UiLCJzaG93TXVsdGlTdHJpbmciLCJnbG9iYWxUcmFuc2xhdGUiLCJleHRfVXBkYXRlTW9kdWxlRXJyb3IiLCIkIiwiZmluZCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJkX3N0YXR1c19wcm9ncmVzcyIsImNsb3Nlc3QiLCJ0ZXh0IiwiTW9kdWxlc0luc3RhbGxNb2R1bGUiLCJmaWxlUGF0aCIsImNiQWZ0ZXJNb2R1bGVJbnN0YWxsIiwicmVzdWx0IiwiZGF0YSIsImluc3RhbGxTdGF0dXNMb29wV29ya2VyIiwibW9kdWxlV2FzRW5hYmxlZCIsImV4dF9JbnN0YWxsYXRpb25FcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQSx1QkFBdUIsR0FBRztBQUM1QjtBQUNKO0FBQ0E7QUFD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UUFBakQsRUFBMkRuQixRQUFRLENBQUNzQixJQUFULENBQWNFLGdCQUF6RTtBQUNILEtBRkQsTUFFTztBQUNIakIsTUFBQUEsV0FBVyxDQUFDQyxlQUFaLENBQTRCUixRQUE1QixFQUFzQ1MsZUFBZSxDQUFDZ0IscUJBQXREO0FBQ0g7QUFDSjtBQTNHMkIsQ0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogTWlrb1BCWCAtIGZyZWUgcGhvbmUgc3lzdGVtIGZvciBzbWFsbCBidXNpbmVzc1xuICogQ29weXJpZ2h0IMKpIDIwMTctMjAyMyBBbGV4ZXkgUG9ydG5vdiBhbmQgTmlrb2xheSBCZWtldG92XG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uOyBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLlxuICogSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vKiBnbG9iYWwgZ2xvYmFsUm9vdFVybCwgUGJ4QXBpLCBnbG9iYWxUcmFuc2xhdGUsIFVzZXJNZXNzYWdlLCBpbnN0YWxsU3RhdHVzTG9vcFdvcmtlciAqL1xuXG4vKipcbiAqIE1vbml0b3JzIHRoZSBzdGF0dXMgb2YgbW9kdWxlIHVwZ3JhZGUuXG4gKlxuICogQG1vZHVsZSB1cGdyYWRlU3RhdHVzTG9vcFdvcmtlclxuICovXG5jb25zdCB1cGdyYWRlU3RhdHVzTG9vcFdvcmtlciA9IHtcbiAgICAvKipcbiAgICAgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgZmV0Y2hpbmcgbmV3IHN0YXR1cyByZXF1ZXN0LlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGltZU91dDogMTAwMCxcblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgdGltZXIgZnVuY3Rpb24gZm9yIHRoZSBzdGF0dXMgd29ya2VyLlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGltZU91dEhhbmRsZTogMCxcblxuICAgIC8qKlxuICAgICAqIFRoZSB1bmlxdWUgSUQgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIG1vZHVsZVVuaXFpZDogJycsXG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIGl0ZXJhdGlvbnMuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBpdGVyYXRpb25zOiAwLFxuXG4gICAgLyoqXG4gICAgICogVGhlIG9sZCBwcm9ncmVzcyBwZXJjZW50YWdlLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgb2xkUGVyY2VudDogJzAnLFxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIG1vZHVsZSB1cGdyYWRlIHN0YXR1cy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pcWlkIC0gVGhlIHVuaXF1ZSBJRCBvZiB0aGUgbW9kdWxlLlxuICAgICAqL1xuICAgIGluaXRpYWxpemUodW5pcWlkKSB7XG4gICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLm1vZHVsZVVuaXFpZCA9IHVuaXFpZDtcbiAgICAgICAgdXBncmFkZVN0YXR1c0xvb3BXb3JrZXIuaXRlcmF0aW9ucyA9IDA7XG4gICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnJlc3RhcnRXb3JrZXIoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzdGFydHMgdGhlIHVwZ3JhZGUgc3RhdHVzIHdvcmtlci5cbiAgICAgKi9cbiAgICByZXN0YXJ0V29ya2VyKCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnRpbWVvdXRIYW5kbGUpO1xuICAgICAgICB1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci53b3JrZXIoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVGhlIHdvcmtlciBmdW5jdGlvbiB0aGF0IGNoZWNrcyB0aGUgbW9kdWxlIHVwZ3JhZGUgc3RhdHVzLlxuICAgICAqL1xuICAgIHdvcmtlcigpIHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci50aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgUGJ4QXBpLk1vZHVsZXNNb2R1bGVEb3dubG9hZFN0YXR1cyhcbiAgICAgICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLm1vZHVsZVVuaXFpZCxcbiAgICAgICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLmNiUmVmcmVzaE1vZHVsZVN0YXR1cyxcbiAgICAgICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnJlc3RhcnRXb3JrZXIsXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlZnJlc2ggdGhlIG1vZHVsZSB1cGdyYWRlIHN0YXR1cy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgLSBUaGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyLlxuICAgICAqL1xuICAgIGNiUmVmcmVzaE1vZHVsZVN0YXR1cyhyZXNwb25zZSkge1xuICAgICAgICB1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5pdGVyYXRpb25zICs9IDE7XG4gICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnRpbWVvdXRIYW5kbGUgPVxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQodXBncmFkZVN0YXR1c0xvb3BXb3JrZXIud29ya2VyLCB1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci50aW1lT3V0KTtcbiAgICAgICAgLy8gQ2hlY2sgZG93bmxvYWQgc3RhdHVzXG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gZmFsc2VcbiAgICAgICAgICAgICYmIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLml0ZXJhdGlvbnMgPCA1MCkge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci50aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIGlmICh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5pdGVyYXRpb25zID4gNTBcbiAgICAgICAgICAgIHx8IHJlc3BvbnNlLmRfc3RhdHVzID09PSAnUFJPR1JFU1NfRklMRV9OT1RfRk9VTkQnXG4gICAgICAgICAgICB8fCByZXNwb25zZS5kX3N0YXR1cyA9PT0gJ05PVF9GT1VORCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLnRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9IChyZXNwb25zZS5kX2Vycm9yICE9PSB1bmRlZmluZWQpID8gcmVzcG9uc2UuZF9lcnJvciA6ICcnO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpO1xuICAgICAgICAgICAgVXNlck1lc3NhZ2Uuc2hvd011bHRpU3RyaW5nKGVycm9yTWVzc2FnZSwgZ2xvYmFsVHJhbnNsYXRlLmV4dF9VcGRhdGVNb2R1bGVFcnJvcik7XG4gICAgICAgICAgICAkKGAjJHt1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5tb2R1bGVVbmlxaWR9YCkuZmluZCgnaScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAkKCcubmV3LW1vZHVsZS1yb3cnKS5maW5kKCdpJykuYWRkQ2xhc3MoJ2Rvd25sb2FkJykucmVtb3ZlQ2xhc3MoJ3JlZG8nKTtcbiAgICAgICAgICAgICQoJ2EuYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuZF9zdGF0dXMgPT09ICdET1dOTE9BRF9JTl9QUk9HUkVTUycpIHtcbiAgICAgICAgICAgIGlmICh1cGdyYWRlU3RhdHVzTG9vcFdvcmtlci5vbGRQZXJjZW50ICE9PSByZXNwb25zZS5kX3N0YXR1c19wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLml0ZXJhdGlvbnMgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnaS5sb2FkaW5nLnJlZG8nKS5jbG9zZXN0KCdhJykuZmluZCgnLnBlcmNlbnQnKS50ZXh0KGAke3Jlc3BvbnNlLmRfc3RhdHVzX3Byb2dyZXNzfSVgKTtcbiAgICAgICAgICAgIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLm9sZFBlcmNlbnQgPSByZXNwb25zZS5kX3N0YXR1c19wcm9ncmVzcztcbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5kX3N0YXR1cyA9PT0gJ0RPV05MT0FEX0NPTVBMRVRFJykge1xuICAgICAgICAgICAgJCgnaS5sb2FkaW5nLnJlZG8nKS5jbG9zZXN0KCdhJykuZmluZCgnLnBlcmNlbnQnKS50ZXh0KCcxMDAlJyk7XG4gICAgICAgICAgICBQYnhBcGkuTW9kdWxlc0luc3RhbGxNb2R1bGUocmVzcG9uc2UuZmlsZVBhdGgsIHVwZ3JhZGVTdGF0dXNMb29wV29ya2VyLmNiQWZ0ZXJNb2R1bGVJbnN0YWxsKTtcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodXBncmFkZVN0YXR1c0xvb3BXb3JrZXIudGltZW91dEhhbmRsZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgaW5zdGFsbGluZyB0aGUgbW9kdWxlLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSAtIFRoZSByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICovXG4gICAgY2JBZnRlck1vZHVsZUluc3RhbGwocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3VsdCA9PT0gdHJ1ZSAmJiByZXNwb25zZS5kYXRhLmZpbGVQYXRoICE9PScnICkge1xuICAgICAgICAgICAgaW5zdGFsbFN0YXR1c0xvb3BXb3JrZXIuaW5pdGlhbGl6ZShyZXNwb25zZS5kYXRhLmZpbGVQYXRoLCByZXNwb25zZS5kYXRhLm1vZHVsZVdhc0VuYWJsZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVXNlck1lc3NhZ2Uuc2hvd011bHRpU3RyaW5nKHJlc3BvbnNlLCBnbG9iYWxUcmFuc2xhdGUuZXh0X0luc3RhbGxhdGlvbkVycm9yKTtcbiAgICAgICAgfVxuICAgIH0sXG59O1xuIl19