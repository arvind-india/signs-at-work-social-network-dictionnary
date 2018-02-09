/*
 * #%L
 * Telsigne
 * %%
 * Copyright (C) 2016 Orange
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * #L%
 */

var HIDDEN_CLASS = 'sign-view-hidden';
//var NB_SIGN_VIEWS_INC = 16;
var NB_SIGN_VIEWS_INC = 6;
var REVEAL_DURATION_MS = 1000;

var signsContainer = document.getElementById("signs-container");
/** Live node list (updated while we iterate over it...) */
var signViewsHidden = signsContainer.getElementsByClassName(HIDDEN_CLASS);

var signsCount = signsContainer.children.length;

var displayedSignsCount = 0;
var modeSearch = new Boolean(false);

var search_criteria = document.getElementById("search-criteria");

var accentMap = {
  "é": "e",
  "è": "e",
  "ê": "e",
  "à": "a",
  "â": "a",
  "î": "i",
  "ô": "o",
  "ù": "u",
  "î": "i",
  "ç": "c"
};

var normalize = function( term ) {
  var ret = "";
  for ( var i = 0; i < term.length; i++ ) {
    ret += accentMap[ term.charAt(i) ] || term.charAt(i);
  }
  return ret;
};

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position){
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

function showSignView(signView) {
  signView.style.opacity = "0";
  signView.className = signView.className.replace(HIDDEN_CLASS, '');
  var img = signView.getElementsByTagName('img')[0];
  var thumbnailUrl = img.dataset.src;
  img.src = thumbnailUrl;
  $(signView).fadeTo(REVEAL_DURATION_MS, 1);
}

function showNextSignViews() {
  var viewsToReveal = [];
  for (var i = 0; i < NB_SIGN_VIEWS_INC && i < signViewsHidden.length; i++) {
    viewsToReveal.push(signViewsHidden[i]);
  }
  for (var i = 0; i < viewsToReveal.length; i++) {
    showSignView(viewsToReveal[i]);
    displayedSignsCount++;
  }
  console.log("total: " + signsCount + ", hidden: " + signViewsHidden.length + ", displayedSignsCount: " + displayedSignsCount);
}

function onScroll(event) {
  var noMoreHiddenSigns = signViewsHidden.length === 0;
  var closeToBottom = $(window).scrollTop() + $(window).height() > $(document).height() - $(window).height()/5;
  if (!modeSearch) {
    //console.log("search hidden");
    if(!noMoreHiddenSigns && closeToBottom) {
      showNextSignViews();
    }
  } else {
    //console.log("search show");
  }
}


function search(event) {
  var g = normalize($(this).val());

  if (g!="") {
    $("#signs-container").children("div").each(function () {
      $("#reset").css("visibility", "visible");
      $("#reset").show();
      var s = normalize($(this).attr("id"));
      var img = $(this).find("img")[0];
      if (s.toUpperCase().startsWith(g.toUpperCase()) == true) {
        if ($(this).hasClass("sign-view-hidden")) {
          $(this).removeClass('sign-view-hidden');
          var thumbnailUrl = img.dataset.src;
          img.src = thumbnailUrl;
          displayedSignsCount++;
        }
        $(this).show();

      }
      else {
        $(this).hide();
      }
    });
  } else {
    $("#reset").css("visibility", "hidden");
    $("#reset").hide();
    if (modeSearch == true) {
      $("#signs-container").children("div").each(function () {
        $(this).hide();
      });
    } else {
      $("#signs-container").children("div").each(function () {
        $(this).show();
      });
    }
  }
}

function searchAfterReload(search_value) {
  var g = normalize(search_value);

  if (g!="") {
    $("#signs-container").children("div").each(function () {
      $("#reset").css("visibility", "visible");
      $("#reset").show();
      var s = normalize($(this).attr("id"));
      var img = $(this).find("img")[0];
      if (s.toUpperCase().startsWith(g.toUpperCase()) == true) {
        if ($(this).hasClass("sign-view-hidden")) {
          $(this).removeClass('sign-view-hidden');
          var thumbnailUrl = img.dataset.src;
          img.src = thumbnailUrl;
          displayedSignsCount++;
        }
        $(this).show();

      }
      else {
        $(this).hide();
      }
    });
  } else {
    $("#reset").css("visibility", "hidden");
    $("#reset").hide();
    if (modeSearch == true) {
      $("#signs-container").children("div").each(function () {
        $(this).hide();
      });
    } else {
      $("#signs-container").children("div").each(function () {
        $(this).show();
      });
    }
  }
}

function scrollBarVisible() {
  return $(document).height() > $(window).height();
}

function initWithFirstSigns() {
  do {
    showNextSignViews();
  } while(!scrollBarVisible() && displayedSignsCount != signsCount);
}

function onReset(event) {

  $(':input', '#myform')
    .not(':button, :submit, :reset, :hidden')
    .val('');
  $("#reset").css("visibility", "hidden");
  $("#reset").hide();
  if (modeSearch == true) {
    $("#signs-container").children("div").each(function () {
      $(this).hide();
    });
  } else {
    $("#signs-container").children("div").each(function () {
      $(this).show();
    });
  }

}


function main() {
  // show first signs at load

 /* var search_criteria = document.getElementById("search-criteria");*/
  if (search_criteria == null) {
    initWithFirstSigns();
    modeSearch=false;
    document.addEventListener('scroll', onScroll);
  } else {
    search_criteria.addEventListener('keyup', search);
    if (search_criteria.classList.contains("search-hidden")) {
      initWithFirstSigns();
      modeSearch=false;
      document.addEventListener('scroll', onScroll);
    } else {
      modeSearch = true;
      var button_reset = document.getElementById("reset");
      if (button_reset != null) {
        button_reset.addEventListener('click', onReset);
      }
    }
  }

}

function onFiltre(event, href) {
  console.log("onFiltre");
  event.preventDefault();
  console.log("href "+href);
  $.ajax({
    url: href,
    context: document.body,
    success: function (response) {
      console.log("Success ");
      document.getElementById("frame-signs").innerHTML = response;
      signsContainer = document.getElementById("signs-container");
      signViewsHidden = signsContainer.getElementsByClassName(HIDDEN_CLASS);
      signsCount = signsContainer.children.length;
      displayedSignsCount = 0;
      main();
      if (modeSearch == true) {
        console.log("search value "+search_criteria.value);
        searchAfterReload(search_criteria.value);
      }
    },
    error: function (response) {
      console.log("Erreur ");
    }
  })
}

(function signViewsLazyLoading($) {
 /* var HIDDEN_CLASS = 'sign-view-hidden';
  //var NB_SIGN_VIEWS_INC = 16;
  var NB_SIGN_VIEWS_INC = 6;
  var REVEAL_DURATION_MS = 1000;

  var signsContainer = document.getElementById("signs-container");
  /!** Live node list (updated while we iterate over it...) *!/
  var signViewsHidden = signsContainer.getElementsByClassName(HIDDEN_CLASS);

  var signsCount = signsContainer.children.length;

  var displayedSignsCount = 0;
  var modeSearch = new Boolean(false);

  var accentMap = {
    "é": "e",
    "è": "e",
    "ê": "e",
    "à": "a",
    "â": "a",
    "î": "i",
    "ô": "o",
    "ù": "u",
    "î": "i",
    "ç": "c"
  };

  var normalize = function( term ) {
    var ret = "";
    for ( var i = 0; i < term.length; i++ ) {
      ret += accentMap[ term.charAt(i) ] || term.charAt(i);
    }
    return ret;
  };

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  function showSignView(signView) {
    signView.style.opacity = "0";
    signView.className = signView.className.replace(HIDDEN_CLASS, '');
    var img = signView.getElementsByTagName('img')[0];
    var thumbnailUrl = img.dataset.src;
    img.src = thumbnailUrl;
    $(signView).fadeTo(REVEAL_DURATION_MS, 1);
  }

  function showNextSignViews() {
    var viewsToReveal = [];
    for (var i = 0; i < NB_SIGN_VIEWS_INC && i < signViewsHidden.length; i++) {
      viewsToReveal.push(signViewsHidden[i]);
    }
    for (var i = 0; i < viewsToReveal.length; i++) {
      showSignView(viewsToReveal[i]);
      displayedSignsCount++;
    }
    console.log("total: " + signsCount + ", hidden: " + signViewsHidden.length + ", displayedSignsCount: " + displayedSignsCount);
  }

  function onScroll(event) {
    var noMoreHiddenSigns = signViewsHidden.length === 0;
    var closeToBottom = $(window).scrollTop() + $(window).height() > $(document).height() - $(window).height()/5;
    if (!modeSearch) {
      //console.log("search hidden");
      if(!noMoreHiddenSigns && closeToBottom) {
        showNextSignViews();
      }
    } else {
      //console.log("search show");
    }
    }


  function search(event) {
    var g = normalize($(this).val());

    if (g!="") {
      $("#signs-container").children("div").each(function () {
        $("#reset").css("visibility", "visible");
        $("#reset").show();
        var s = normalize($(this).attr("id"));
        var img = $(this).find("img")[0];
        if (s.toUpperCase().startsWith(g.toUpperCase()) == true) {
          if ($(this).hasClass("sign-view-hidden")) {
            $(this).removeClass('sign-view-hidden');
            var thumbnailUrl = img.dataset.src;
            img.src = thumbnailUrl;
            displayedSignsCount++;
          }
          $(this).show();

        }
        else {
          $(this).hide();
        }
      });
    } else {
      $("#reset").css("visibility", "hidden");
      $("#reset").hide();
      if (modeSearch == true) {
        $("#signs-container").children("div").each(function () {
          $(this).hide();
        });
      } else {
        $("#signs-container").children("div").each(function () {
          $(this).show();
        });
      }
    }
  }

  function scrollBarVisible() {
    return $(document).height() > $(window).height();
  }

  function initWithFirstSigns() {
    do {
      showNextSignViews();
    } while(!scrollBarVisible() && displayedSignsCount != signsCount);
  }

  function onReset(event) {

      $(':input', '#myform')
        .not(':button, :submit, :reset, :hidden')
        .val('');
      $("#reset").css("visibility", "hidden");
      $("#reset").hide();
      if (modeSearch == true) {
        $("#signs-container").children("div").each(function () {
          $(this).hide();
        });
      } else {
        $("#signs-container").children("div").each(function () {
          $(this).show();
        });
      }

  }


  function main() {
    // show first signs at load

    var search_criteria = document.getElementById("search-criteria");
    if (search_criteria == null) {
      initWithFirstSigns();
      modeSearch=false;
      document.addEventListener('scroll', onScroll);
    } else {
      search_criteria.addEventListener('keyup', search);
      if (search_criteria.classList.contains("search-hidden")) {
        initWithFirstSigns();
        modeSearch=false;
        document.addEventListener('scroll', onScroll);
      } else {
        modeSearch = true;
        var button_reset = document.getElementById("reset");
        if (button_reset != null) {
          button_reset.addEventListener('click', onReset);
        }
      }
    }

  }*/


  main();

})($);