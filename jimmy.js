
var links = [];
var dates = [];
var hours = [];
var tickets = [];
var casper = require('casper').create();
var startURL = 'http://www.showclix.com/event/thetonightshowstarringjimmyfallon',
xPaths,
x = require('casper').selectXPath;

function getLinks() {
  links = document.querySelectorAll('td.has_event_style1 a');
  return links
}

function getDates() {
  var dates = document.querySelectorAll('td.has_event_style1 a');
  return Array.prototype.map.call(dates, function(e) {
    return e.innerHTML;
  });
}

function getHours() {
  var links = document.querySelectorAll('select#event_time option');
  return Array.prototype.map.call(links, function(e) {
    return e.innerHTML;
  });
}

casper.start(startURL);

casper.then(function getLinks(){
  xPaths = this.evaluate(function(){
    // copied from http://stackoverflow.com/a/5178132/1816580
    function createXPathFromElement(elm) {
      var allNodes = document.getElementsByTagName('*'); 
      for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) { 
        if (elm.hasAttribute('id')) { 
          var uniqueIdCount = 0; 
          for (var n=0;n < allNodes.length;n++) { 
            if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++; 
            if (uniqueIdCount > 1) break; 
          }; 
          if ( uniqueIdCount == 1) { 
            segs.unshift('id("' + elm.getAttribute('id') + '")'); 
            return segs.join('/'); 
          } else { 
            segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]'); 
          } 
        } else if (elm.hasAttribute('class')) { 
          segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]'); 
        } else { 
          for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
            if (sib.localName == elm.localName)  i++; }; 
            segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
        }; 
      }; 
      return segs.length ? '/' + segs.join('/') : null; 
    };
    //var links = document.getElementsByTagName('a');
    var links = document.querySelectorAll('td.has_event_style1 a');
    var xPaths = Array.prototype.map.call(links, createXPathFromElement);
    return xPaths;
  });
});

casper.then(function(){
  this.each(xPaths, function(self, xpath){
    self.thenOpen(startURL);
    self.thenClick(x(xpath));
    // waiting some time may be necessary for single page applications
    self.wait(1000);
    self.then(function(a){
      // do something meaningful here
      hours = this.evaluate(getHours);
      this.echo(hours.length + ' Available Hours Found:');
      this.echo(' - ' + hours.join('\n - '));
      this.echo(xpath);
      this.echo(this.getCurrentUrl());
    });
  });
});
casper.run(function(){
  this.exit();
});

//casper.then(function() {
//    //that = this;
//    //links = this.evaluate(getLinks);
//    dates = this.evaluate(getDates);
//    links = this.evaluate(getLinks);
//    this.echo(links.length + ' links found ')
//    for (i = 0; i < links.length; ++i) {
//      this.echo('About to click' + links[i])
//      this.click('td.has_event_style1 a');
//      //casper.wait(1000, function() {
//      //    this.echo("I've clicked a link and waited for a second.");
//      //});
//      hours = this.evaluate(getHours);
//      this.echo(hours.length + ' Available Hours Found:');
//      this.echo(' - ' + hours.join('\n - ')).exit();
//    }
//    //this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
//});
//
//casper.then(function() {
//    // aggregate results for the 'phantomjs' search
//    //links = links.concat(this.evaluate(getDates));
//});
//
//casper.run(function() {
//    // echo results in some pretty fashion
//    this.echo(dates.length + ' Available Days Found:');
//    this.echo(' - ' + dates.join('\n - ')).exit();
//});
//
//casper.test.begin('Tests to see if there are any available Jimmy Falon tickets', 1, function suite(test) {
//
//  casper.start('http://www.showclix.com/event/thetonightshowstarringjimmyfallon', function() {
//    // Verify that there are events
//    test.assertExists('a.ui-state-active', '"Active Event" link is found.');
//    // 10 articles should be listed.
//    //test.assertElementCount('article', 10, '10 articles are listed.');
//  });
//
//  casper.run(function() {
//    test.done();
//  });
//});
