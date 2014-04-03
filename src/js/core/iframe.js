define(['settings', 'core/agent'], function (settings, agent) {
  /**
   * Iframe functions
   */
  var iframe = (function () {

    /**
     * get document from iframe
     * @param {jQuery} iframe
     * @return {Object} document object of iframe
     */

    var doc = function ($iframe) {
      if (agent.bMSIE) {
        return $iframe[0].contentWindow.document;
      } else {
        return $iframe[0].contentDocument;
      }
    };

    /**
     * get document element from iframe
     * @param {jQuery} iframe
     * @return {jQuery} document element
     */

    var docEl = function ($iframe) {
      return $(doc($iframe).documentElement) || false;
    };

    /**
     * get doctype from iframe
     * @param {jQuery} iframe
     * @return {String}
     */

    var docType = function ($iframe) {
      var iframeDoc = doc($iframe);
 
      if (!iframeDoc.doctype) {
        return ''; // no doctype
      } else {
        var aDoctype = [];

        // recreate doctype (there must be a better way to do this?)
        aDoctype.push('<!DOCTYPE ');
        if (iframeDoc.doctype.name) {
          aDoctype.push(iframeDoc.doctype.name);
        }
        if (iframeDoc.doctype.publicId) {
          aDoctype.push(' PUBLIC "' + iframeDoc.doctype.publicId + '"');
        }
        if (!iframeDoc.doctype.publicId && iframeDoc.doctype.systemId) {
          aDoctype.push(' SYSTEM');
        }
        if (iframeDoc.doctype.systemId) {
          aDoctype.push(' "' + iframeDoc.doctype.systemId + '"');
        }
        aDoctype.push('>');

        return aDoctype.join();
      }
    };

    var setHtml = function ($iframe, html) {
      $iframe.contents().find('html').get(0).innerHTML = html;
      $iframe.contents().find('head').append($iframe.data('options').injectHtml);
      $iframe.contents().find($iframe.data('options').editableSelector).attr('contentEditable', 'true');
      return $iframe;
    };

    var getHtml = function ($iframe) {
      var doctype = '';
      var html = '';

      if ($iframe.data('options').onlyBody) {
        html = $iframe.contents().find('body').html();
      } else {
        doctype = docType($iframe);
        $iframe.contents().find('[contentEditable="true"]').removeAttr('contentEditable'); //remove contenteditable
        $iframe.contents().find('.summernote-injected').remove(); //remove injected
        html = '<html>' + $iframe.contents().find('html').get(0).innerHTML + '</html>';
      }
      return doctype + html;
    };

    /**
     * get/set entire html contents for iframe
     * @param {jQuery} editable iframe
     * @return {String} html of iframe
     */

    var html = function ($iframe, html) {
      if (html === undefined) {
        return getHtml($iframe);
      } else {
        return setHtml($iframe, html);
      }
    };

    /**
     * pass summernote iframe options, convert into object if needed
     * @param {jQuery} editable iframe
     * @param {Object} options.iframe from settings 
     */

    var setup = function ($iframe, options) {
      var defaults = {
        onlyBody: true,
        editableSelector: 'body',
        injectHtml: ''
      };

      if (typeof options === 'object') {
        $iframe.data('options', $.extend(defaults, options));
      } else {
        $iframe.data('options', defaults);
      }

      return $iframe.data('options');
    };
  
    return {
      doc: doc,
      docEl: docEl,
      docType: docType,
      html: html,
      setup: setup
    };
  })();
  return iframe;
});
