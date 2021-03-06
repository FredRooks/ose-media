'use strict';

var Ose = require('ose');
var M = Ose.module(module);
var Common = require('./common');

// Public {{{1
exports.displayLayout = function() {  // {{{2
  $('<section>', {
    'data-type': 'list',
  })
  .appendTo(this.$())
  .append(
    $('<ul>').append([
      $('<li>').append([
//        $('<p>').text('Now playing'),
        $('<p>', {'class': 'title'}).text('')
        ])
      .on('click',
        Ose.ui.tapBit({
          space: this.key.space,
          bit: 'detail',
          shard: 'media',
          entry: 'player'
        })
      )
    ])
  );

  this.$().append(Common.controls(this));

  updateTitle(this);
};

exports.updateState = function(state) {  // {{{2
  for (var key in state) {
    switch (key) {
      case 'canPause':
        if (state.canPause) {
          this.$('playPause').parent('div.ui-checkbox').show();
        } else {
          this.$('playPause').parent('div.ui-checkbox').hide();
        }
        break;
      case 'player':
        /*
        if (state.player === 'playing') {
          this.button('pause', {label: 'Pause'});
        } else {
          this.button('pause', {label: 'Play'});
        }
        */

        updateTitle(this);

        break;
      case 'fullscreen':
        M.log.missing();

//        this.button('fullscreen', state.fullscreen);
        break;
      case 'artist':
      case 'organization':
      case 'title':
      case 'playing':
        updateTitle(this);

        break;
    }
  }
};

exports.updateSync = function(val) {  // {{{2
  updateTitle(this);
};

// }}}1
// Private {{{1
function updateTitle(that) {  // {{{2
  if (! that.entry.isSynced()) {
    that.$(' .title').text('Not connected to player');
    return;
  }

  switch (that.entry.state.player) {
    case undefined:
    case null:
    case '':
    case 'stop':
      that.$(' .title').text('Stopped');
      return;
    case 'playing':
      that.$(' .title').text(Common.getTitle(that.entry.state));
      return;
    default:
      that.$(' .title').text('Unhandled');
      M.log.unhandled('State', that.entry.state.player);
      return;
  }
}

// }}}1
