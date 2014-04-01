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
 
      if (iframeDoc.doctype === null) {
        return ''; // no doctype
      } else {
        var aDoctype = [];

        // recreate doctype (there must be a better way to do this?)
        aDoctype.push('<!DOCTYPE ');
        if (iframeDoc.docType.name) {
          aDoctype.push(iframeDoc.docType.name);
        }
        if (iframeDoc.docType.publicId) {
          aDoctype.push(' PUBLIC "' + iframeDoc.docType.publicId + '"');
        }
        if (!iframeDoc.docType.publicId && iframeDoc.docType.systemId) {
          aDoctype.push(' SYSTEM');
        }
        if (iframeDoc.docType.systemId) {
          aDoctype.push(' "' + iframeDoc.docType.systemId + '"');
        }
        aDoctype.push('>');

        return aDoctype.join();
      }
    };

    var setHtml = function ($iframe, html) {
      $iframe.contents().find('html').html(html);
      $iframe.contents().find('head').append($iframe.data('options').injectHtml);
      $iframe.contents().find($iframe.data('options').editableSelector).attr('contentEditable', 'true');
      return $iframe;
    };

    var getHtml = function ($iframe) {
      var $iframeDoc = docEl($iframe);
      var doctype = '';
      var html = '';

      if ($iframe.data('options').onlyBody) {
        html = $iframeDoc.find('body').html();
      } else {
        doctype = docType($iframe);
        $iframeDoc.find('[contentEditable="true"]').removeAttr('contentEditable'); //remove contenteditable
        $iframeDoc.find('.summernote-injected').remove(); //remove injected
        html = '<html>' + $iframeDoc.html() + '</html>';
      }

      return doctype + html;
    };

    /**
     * get entire html contents from iframe
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
