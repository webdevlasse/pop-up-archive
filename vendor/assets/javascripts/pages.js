var isMovingCauseOfTimer = false;
var boxWidth = 100;


$(function(){
  init();

  var pageNumber = parseInt(window.location.hash.split('#').pop(), 10);
  if(pageNumber)
    gotoPage(pageNumber);

  initAudio();

  var scrollStopTimer = null;
  $(window).scroll(function(){
    if(isMovingCauseOfTimer){
      isMovingCauseOfTimer = false;
      return true;
    }

    listenToScroll();

   if(scrollStopTimer){
      clearTimeout(scrollStopTimer);
      scrollStopTimer = null;
    }
    scrollStopTimer = setTimeout(scrollStopped, 400);
  });

  var resizeStopTimer = null;
  $(window).resize(function(){
    if(resizeStopTimer){
      clearTimeout(resizeStopTimer);
      resizeStopTimer = null;
    }
    resizeStopTimer = setTimeout(init, 400);
  });

  $('.internal-link').click(function(){
    var pageNumber = parseInt(this.href.split('#').pop(),10);
    isMovingCauseOfTimer = true;
    gotoPage(pageNumber);
    setNavState(pageNumber);
  });

  $('.sub-navigation li a').hover(function(){
    $(this).parent().find('.text').addClass('hover');
  },
  function(){
    $(this).parent().find('.text').removeClass('hover');
  });
});

function listenToScroll(){
  $('#pages_container').stop();

  var currentVerticalScroll = $(window).scrollTop();
  var bodyHeight = $('body').height() - window.innerHeight;
  var pagesWidth = $('.slide').width() * ($('.slide').length - 1);

  var calculatedHorizontalScroll = -pagesWidth * (currentVerticalScroll / bodyHeight);

  $('#pages_container').animate({'left': calculatedHorizontalScroll}, 10, function(){
    setNavState();
  });

  setNavState();

};

function scrollStopped(){
  isMovingCauseOfTimer = true;

  var currentPage = Math.round(-$('#pages_container').offset().left / $('.slide').width()) + 1;

  gotoPage(Math.min(currentPage, 7));
};

function init(){
  //Set the width of each page
  $('.slide').width(window.innerWidth);

  //Load the SVG for each page
  initSVGMatrix();
  loadPage1();
  loadPage2();
  loadPage3();
  //loadPage4();
  loadPage4();
  loadPage5();
  loadPage6();
  loadPage7();

  listenToScroll();
  $(window).scroll();
  if(lastStoredPage){
    var tmpPage = lastStoredPage;
    lastStoredPage = null;
    gotoPage(tmpPage);
  }
};

var lastStoredPage;
function gotoPage(pageNumber){
  switch(pageNumber){
    case 1:
      if(lastStoredPage != 1){
        startPage1();
        lastStoredPage = 1;
      }
      break;
     case 2:
      if(lastStoredPage != 2){
        startPage2();
        lastStoredPage = 2;
      }
      break;
    case 3:
      if(lastStoredPage != 3){
        startPage3();
        lastStoredPage = 3;
      }
      break;
/*    case 4:
      if(lastStoredPage != 4){
        startPage4();
        lastStoredPage = 4;
      }
      break;*/
    case 4:
      if(lastStoredPage != 4){
        startPage4();
        lastStoredPage = 4;
      }
      break;
    case 5:
      if(lastStoredPage != 5){
        startPage5();
        lastStoredPage = 5;
      }
      break;
     case 6:
      if(lastStoredPage != 6){
        startPage6();
        lastStoredPage = 6;
      }
      break;
    case 7:
      if(lastStoredPage != 7){
        startPage7();
        lastStoredPage = 7;
      }
      break;
  }

  /*SCROLL*/
  var page = $('#page_' + pageNumber);
  var currentOffset = $('#pages_container').offset().left;

  var pageOffset = page.offset().left;
  $('#pages_container').stop().animate({'left': currentOffset - pageOffset}, 1000, function(){
    setNavState();
  });

  var bodyHeight = $('body').height() - window.innerHeight;
  var pagesWidth = $('.slide').width() * ($('.slide').length - 1);
  var calculatedVerticalScroll = -bodyHeight * ((currentOffset - pageOffset) / pagesWidth);

  $(window).scrollTop(calculatedVerticalScroll);

  setNavState();
}

function setNavState(page){
  var currentPage = page != null ? page : Math.round(-$('#pages_container').offset().left / $('.slide').width()) + 1;
  $('.sub-navigation li .active').removeClass('active');
  $('.sub-navigation li a[href="/#' + currentPage + '"]').addClass('active');
  $('.sub-navigation li a[href="/#' + currentPage + '"]').parent().find('.text').addClass('active');
};

function stopAll(){
  //pauseAllAudio();
  clearInterval(page2IntervalTimer);
  clearInterval(page3IntervalTimer);
  //resetPage4();
  clearInterval(page4IntervalTimer);
  resetPage4();
  clearInterval(page5IntervalTimer);
  clearInterval(page6IntervalTimer);
  clearInterval(page7IntervalTimer);
  resetPage7();
};

var circleMatrices;
var circleMatrix;

function loadPage1(){
  circleMatrix = circleMatrices[0];

  for(var x = 0; x < circleMatrix.length; x++){
    for(var y = 0; y < circleMatrix[x].length; y++){
      if(typeof circleMatrix[x][y] == 'undefined')
        continue;

      var circle = circleMatrix[x][y];
      circle.move(circle.x + 150*Math.random() - 75, circle.y + 150*Math.random() - 75);
      circle.isRandomPosition = true;

      circle.audioIndex = Math.floor(AUDIO_SOURCES.length*Math.random());

      circle.setHoverHandler(function(){
        hoverEnterHandler.call(this);
        pauseAllAudio();
        playAudio(this.audioIndex);
      },
      function(){
        if(!this.isVisible()) return;

        pauseAudio(this.audioIndex);

        if(this.clickOn)
          clearInterval(broadcastIntervalTimer);

        if(this.isRandomPosition)
          this.unlockColor().reset(null, null, 'elastic');
        else
          this.unlockColor().reset();

        this.isRandomPosition = false;
        this.clickOn = false;
      });
    }
  }

  //Replace random circle with AudioSource Circle
  var replaceCircleForAudio = getRandomVisibleCircle(0, 0, circleMatrix.length, circleMatrix[0].length);
  replaceCircleForAudio.audioIndex = AUDIO_SOURCES.indexOf(MAIN_AUDIO_SOURCE);
  hoverEnterHandler.call(replaceCircleForAudio);
  playAudio(replaceCircleForAudio.audioIndex);

  //Change sound on mouse move
  var lastMouseEvent;
  var wasTriggered = true;
  setInterval(function()
  {
    if(wasTriggered){
      wasTriggered = false;

      $(window).one('mousemove', function(e) {
        wasTriggered = true;

        var newMouseEvent;
        if(typeof window.performance != 'undefined' && typeof window.performance.now != 'undefined')
         newMouseEvent = {pageX: e.pageX, pageY: e.pageY, time: performance.now()};
        else
        newMouseEvent = {pageX: e.pageX, pageY: e.pageY, time: Date.now()};

        if(lastMouseEvent == null){
          lastMouseEvent = newMouseEvent;
          return;
        }

        var moveSize = Math.sqrt(Math.pow((newMouseEvent.pageX - lastMouseEvent.pageX), 2)*Math.pow((newMouseEvent.pageY - lastMouseEvent.pageY), 2));
        var movePerTime = moveSize / (newMouseEvent.time - lastMouseEvent.time);
        if(movePerTime < 2)
          setPlaybackRate(1);
        else
          setPlaybackRate(3);
//          setPlaybackRate(Math.max(1,Math.round(movePerTime/5)));

        lastMouseEvent = newMouseEvent;
      });
    }
    else{
      setPlaybackRate(1);
    }
  }, 100);
};

function loadPage2(){};


function loadPage3(){};

function loadPage4(){};

function loadPage4(){
  circleMatrix = circleMatrices[3];

  for(var x = 0; x < circleMatrix.length; x++){
    var hideLength = Math.floor(circleMatrix[x].length*Math.random()) - 1;

    for(var y = 0; y <hideLength; y++){
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].hide();
    }
  }
};

function loadPage5(){
  circleMatrix = circleMatrices[4];

  resetPage5();
};

function loadPage6(){
  circleMatrix = circleMatrices[5];

  var contentEl = $('#page_6 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  for(var x = circleMatrix.length - 1; x >= 0 ; x--)
  {

    for(var y = 0; y < circleMatrix[x].length; y++){
      if(typeof circleMatrix[x][y] == 'undefined')
        continue;

      if(x < rightPositionOfContentInBoxes)
      {
        circleMatrix[x][y].setInnerColor(RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())]);;
        circleMatrix[x][y].setOuterColor(RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())]);

        if(circleMatrix[x][y].isVisible() && (
            y == 0 ||
            x == circleMatrix.length - 1 ||
            typeof circleMatrix[x][y-1] == 'undefined' ||
            !circleMatrix[x][y-1].isVisible() ||
            typeof circleMatrix[x+1][y] == 'undefined' ||
            !circleMatrix[x+1][y].isVisible() ||
            typeof circleMatrix[x+1][y-1] == 'undefined' ||
            !circleMatrix[x+1][y -1].isVisible()
          ))
        {
          circleMatrix[x][y].lockColor().colorOn();
        }
        else{
          circleMatrix[x][y].colorOff();
        }
      }
      else if(x == rightPositionOfContentInBoxes)
        circleMatrix[x][y].hide();
      else{
        circleMatrix[x][y].setInnerColor(BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())]);
        circleMatrix[x][y].setOuterColor(BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())]);
        circleMatrix[x][y].colorOff();
      }
    }
  }
};

function loadPage7(){
  circleMatrix = circleMatrices[6];

  resetPage7();
};

function resetPage7(){
  circleMatrix = circleMatrices[6];

  var firstHideHeight = circleMatrix[0].length - 1;
  var secondHideHeight = Math.floor((circleMatrix[0].length - 1) / 2);
  var thirdHideHeight = 0;

  for(var x = 0; x < circleMatrix.length; x++){
    if(x < Math.floor(circleMatrix.length/3)){
      while(firstHideHeight < circleMatrix[x].length && (typeof circleMatrix[x][firstHideHeight] == 'undefined' || !circleMatrix[x][firstHideHeight].isVisible()))
        firstHideHeight++;
      hideHeight = firstHideHeight;
    }
    else if(x < 2*Math.floor(circleMatrix.length/3)){
      while(secondHideHeight < circleMatrix[x].length && (typeof circleMatrix[x][secondHideHeight] == 'undefined' || !circleMatrix[x][secondHideHeight].isVisible()))
        secondHideHeight++;
      hideHeight = secondHideHeight;
    }
    else{
      while(thirdHideHeight < circleMatrix[x].length && (typeof circleMatrix[x][thirdHideHeight] == 'undefined' || !circleMatrix[x][thirdHideHeight].isVisible()))
        thirdHideHeight++;
      hideHeight = thirdHideHeight;
    }

    for(var y = 0; y < hideHeight; y++){
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].hide();
    }

    if(hideHeight == circleMatrix[x].length || typeof circleMatrix[x][hideHeight] == 'undefined')
      continue;

    for(var y =hideHeight; y < circleMatrix[x].length; y++){
      if(x < Math.floor(circleMatrix.length/3)){
        innerColor = BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())];
        outerColor = BLUE_COLORS[Math.floor(BLUE_COLORS.length  * Math.random())];
      }
      else if(x < 2*Math.floor(circleMatrix.length/3)){
        innerColor = YELLOW_COLORS[Math.floor(YELLOW_COLORS.length  * Math.random())];
        outerColor = YELLOW_COLORS[Math.floor(YELLOW_COLORS.length  * Math.random())];
      }
      else{
        innerColor = RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())];
        outerColor = RED_COLORS[Math.floor(RED_COLORS.length  * Math.random())];
      }

      circleMatrix[x][y].setInnerColor(innerColor);
      circleMatrix[x][y].setOuterColor(outerColor);
      circleMatrix[x][y].unlockColor().colorOff();
    }
  }
}

function startPage1(){
  stopAll();
};

var pathQueue = [];
var page2IntervalTimer;
var lastConnectedCircle;
function startPage2(){
  stopAll();

  circleMatrix = circleMatrices[1];

  page2IntervalTimer = setInterval(connectRandomCircle, 2000);
  blurCircles();
};

var bubbleArray;
var page3IntervalTimer;
function startPage3(){
  stopAll();

  circleMatrix = circleMatrices[2];

  //Bubble from bottom to top
  bubbleArray = bubbleArray || new Array(circleMatrix.length);
  page3IntervalTimer = setInterval(bubbleToTop, 500);
};

function startPage4(){
  stopAll();

  circleMatrix = circleMatrices[3];

  var circle1, circle2, count = 50;
  do{
    circle1 = getRandomVisibleCircle(0, 0, circleMatrix.length, circleMatrix[0].length);
    circle2 = getRandomVisibleCircle(0, 0, circleMatrix.length, circleMatrix[0].length);
    count--;
  } while(
    count > 0 && (
    Math.abs(circle1.matrixXIndex - circle2.matrixXIndex) <= 1 ||
    Math.abs(circle1.matrixYIndex - circle2.matrixYIndex) <= 1 ||
    (circle1.matrixXIndex != 0 && typeof circleMatrix[circle1.matrixXIndex - 1][circle1.matrixYIndex] == 'undefined') ||
    (circle2.matrixXIndex != 0 && typeof circleMatrix[circle2.matrixXIndex - 1][circle2.matrixYIndex] == 'undefined') ||
    (circle1.matrixXIndex != circleMatrix.length - 1 && typeof circleMatrix[circle1.matrixXIndex + 1][circle1.matrixYIndex] == 'undefined') ||
    (circle2.matrixXIndex != circleMatrix.length - 1 && typeof circleMatrix[circle2.matrixXIndex + 1][circle2.matrixYIndex] == 'undefined') ||
    (circle1.matrixYIndex != 0 && typeof circleMatrix[circle1.matrixXIndex][circle1.matrixYIndex - 1] == 'undefined') ||
    (circle2.matrixYIndex != 0 && typeof circleMatrix[circle2.matrixXIndex][circle2.matrixYIndex - 1] == 'undefined') ||
    (circle1.matrixYIndex != circleMatrix[0].length - 1 && typeof circleMatrix[circle1.matrixXIndex][circle1.matrixYIndex + 1] == 'undefined') ||
    (circle2.matrixYIndex != circleMatrix[0].length - 1 && typeof circleMatrix[circle2.matrixXIndex][circle2.matrixYIndex + 1] == 'undefined') ||
    (circle1.matrixXIndex != 0 && circle1.matrixYIndex != 0 && typeof circleMatrix[circle1.matrixXIndex - 1][circle1.matrixYIndex - 1] == 'undefined') ||
    (circle2.matrixXIndex != 0 && circle2.matrixYIndex != 0 && typeof circleMatrix[circle2.matrixXIndex - 1][circle2.matrixYIndex - 1] == 'undefined') ||
    (circle1.matrixXIndex != circleMatrix.length - 1 && circle1.matrixYIndex != circleMatrix[0].length - 1 && typeof circleMatrix[circle1.matrixXIndex + 1][circle1.matrixYIndex + 1] == 'undefined') ||
    (circle2.matrixXIndex != circleMatrix.length - 1 && circle2.matrixYIndex != circleMatrix[0].length - 1 && typeof circleMatrix[circle2.matrixXIndex + 1][circle2.matrixYIndex + 1] == 'undefined')
  ));

  circle1.removeClickHandler().removeHoverHandler().scale(5.5, 5000).lockColor().colorOn(5000).startBroadcast(1000, null, null, 0.7).callOnNeighbours(1, function(){
      this.hide(5000);
    });

  if(Math.abs(circle1.matrixXIndex - circle2.matrixXIndex) > 1 && Math.abs(circle1.matrixYIndex - circle2.matrixYIndex) > 1)
    circle2.removeClickHandler().removeHoverHandler().scale(5.5, 5000).lockColor().colorOn(5000).startBroadcast(1000, null, null, 0.7).callOnNeighbours(1, function(){ this.hide(5000); }
    );
};

function resetPage4(){
  circleMatrix = circleMatrices[3];

  for(var x = 0; x < circleMatrix.length; x++)
    for(var y = 0; y < circleMatrix.length; y++)
      if(typeof circleMatrix[x][y] != 'undefined')
      {
        circleMatrix[x][y].unlockColor().reset().setHoverHandler(hoverEnterHandler, hoverLeaveHandler).show();
      }
};

var currentColoredColumnIndex;
var page4IntervalTimer;
function startPage4(){
  stopAll();

  circleMatrix = circleMatrices[3];

  currentColoredColumnIndex = undefined;
  page4IntervalTimer = setInterval(colorColumn, 1000);
};

function resetPage4(){
  circleMatrix = circleMatrices[3];

  if(typeof currentColoredColumnIndex != 'undefined'){
    for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
      if(typeof circleMatrix[currentColoredColumnIndex][y] != 'undefined')
        circleMatrix[currentColoredColumnIndex][y].colorOff();
    }

    currentColoredColumnIndex = undefined;
  }
};

//var swappedInnerRadiuses;
var page5IntervalTimer;
function startPage5(){
  stopAll();

  circleMatrix = circleMatrices[4];

  resetPage5();

  page5IntervalTimer = setInterval(lightupCircles, 2250);
};

var page6IntervalTimer;
function startPage6(){
  stopAll();

  circleMatrix = circleMatrices[5];

  page6IntervalTimer = setInterval(swapCircles, 2000);
};

var currentPage7Section;
var page7IntervalTimer;
function startPage7(){
  stopAll();

  circleMatrix = circleMatrices[6];

  currentPage7Section = 0;

  page7IntervalTimer = setInterval(function(){
    for(var x = 0; x < circleMatrix.length; x++){
      if(currentPage7Section == 0 && x >= Math.floor(circleMatrix.length/3))
        continue;
      else if(currentPage7Section == 1 && x >= 2*Math.floor(circleMatrix.length/3))
        continue;
      else if(currentPage7Section == 2 && x < 2*Math.floor(circleMatrix.length/3))
        continue;

      var colorOn = false;
      for(var y = 0 ; y < circleMatrix[x].length; y++){
        if(!colorOn && typeof circleMatrix[x][y] != 'undefined' && circleMatrix[x][y].isVisible()){
          circleMatrix[x][y].lockColor().colorOn(1000, null, null);
          colorOn = true;
        }
      }
    }

    currentPage7Section++;

    if(currentPage7Section > 2)
      clearInterval(page7IntervalTimer);
  }, 2000);
};

function resetPage5(){
  circleMatrix = circleMatrices[4];

  //Split the screen width in 3 and set size of innerRadius accordingly
  for(var x = 0; x < circleMatrix.length; x++){
    var innerRadius;
    if(x < Math.floor(circleMatrix.length/3)) innerRadius = 10;
    else if(x < 2*Math.floor(circleMatrix.length/3)) innerRadius = 25;
    else innerRadius = 17;

    for(var y = 0; y < circleMatrix[x].length; y++)
      if(typeof circleMatrix[x][y] != 'undefined')
        circleMatrix[x][y].setBaseInnerRadius(innerRadius);
  }
};

function bubbleToTop(){
  for(var x = 0; x < bubbleArray.length; x++){
    var nextBubble;
    var currentBubble = bubbleArray[x];

    if(typeof currentBubble == 'undefined'){
      if(Math.random() < 0.75)
        continue;

      nextBubble = circleMatrix[x][circleMatrix[x].length - 1];
    }
    else{
      if(currentBubble.matrixYIndex == 0 || typeof circleMatrix[x][currentBubble.matrixYIndex - 1] == 'undefined' || !circleMatrix[x][currentBubble.matrixYIndex - 1].isVisible()){
        nextBubble = undefined;
      }
      else
        nextBubble = circleMatrix[x][currentBubble.matrixYIndex - 1];

      //currentBubble.reset(1400, null, null, 0.5);
    }

    if(typeof nextBubble != 'undefined'){
      nextBubble.colorOn().scale(1.5, 1000, function(){
        if(0 == this.matrixYIndex)
          this.sendBroadcast(this.currentOuterRadius(), boxWidth + this.currentOuterRadius(), 0.7);
        else
          this.reset(1000, null, null, 0.5);
      });
    }

    bubbleArray[x] = nextBubble;
  }
};

function colorColumn(){
  if(typeof currentColoredColumnIndex != 'undefined'){
    for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
      if(typeof circleMatrix[currentColoredColumnIndex][y] != 'undefined')
        circleMatrix[currentColoredColumnIndex][y].colorOff(2500);
    }

    currentColoredColumnIndex = currentColoredColumnIndex + 1
  }

  if(typeof currentColoredColumnIndex == 'undefined' || currentColoredColumnIndex >= circleMatrix.length)
    currentColoredColumnIndex = 0;

  for(var y = 0; y < circleMatrix[currentColoredColumnIndex].length; y++){
    if(typeof circleMatrix[currentColoredColumnIndex][y] != 'undefined' && circleMatrix[currentColoredColumnIndex][y].isVisible())
      circleMatrix[currentColoredColumnIndex][y].colorOn(1000);
  }
};

function lightupCircles(){
  circleMatrix = circleMatrices[5];

  //three random circles
  var circle1 = getRandomVisibleCircle(0, 0, Math.floor(circleMatrix.length/3), circleMatrix[0].length);

  var x = Math.floor(circleMatrix.length/3);
  var circle2 = getRandomVisibleCircle(x, 0, Math.floor(circleMatrix.length/3), circleMatrix[x].length);

  x = 2*Math.floor(circleMatrix.length/3);
  var circle3 = getRandomVisibleCircle(x, 0, circleMatrix.length - x, circleMatrix[x].length);

  var color = COLORS[Math.floor(COLORS.length  * Math.random())];
  circle1.setInnerColor(color).setOuterColor(color).lockColor().colorOn(250, function(){
    circle1.unlockColor().colorOff(2000);
  });
  circle2.setInnerColor(color).setOuterColor(color).lockColor().colorOn(250, function(){
    circle2.unlockColor().colorOff(2000);
  })
  circle3.setInnerColor(color).setOuterColor(color).lockColor().colorOn(250, function(){
    circle3.unlockColor().colorOff(2000);
  })

}

function swapCircles(){
  var contentEl = $('#page_6 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  var circle1 = getRandomCircle(rightPositionOfContentInBoxes + 1, 0, circleMatrix.length - rightPositionOfContentInBoxes - 1, circleMatrix[0].length);
  if(circle1 == null)
    return;
  circle1.svgSet.toFront();

  var loop = true;
  var circle2;
  while(loop){
    var newX = circle1.matrixXIndex + Math.round(2*Math.random()) - 1;
    var newY = circle1.matrixYIndex + Math.round(2*Math.random()) - 1;

    if(newX >= circleMatrix.length
      || newY >= circleMatrix.length
      || typeof circleMatrix[newX][newY] == 'undefined'
      || !circleMatrix[newX][newY].isVisible()
      || circleMatrix[newX][newY] == circle1
      )
      continue;

    circle2 = circleMatrix[newX][newY];
    loop = false;
  }
  circle2.svgSet.toFront();

  circle1.colorOn().move(circle2.x, circle2.y, 1000, function(){
    circle1.colorOff(1000);
  });
  circle2.colorOn().move(circle1.x, circle1.y, 1000, function(){
    circle2.colorOff(1000);
  });

  var tmpX = circle1.x, tmpY = circle1.y;

  circle1.x = circle2.x;
  circle1.y = circle2.y;
  circle2.x = tmpX;
  circle2.y = tmpY;

  tmpX =  circle1.matrixXIndex, tmpY = circle1.matrixYIndex;
  circleMatrix[circle2.matrixXIndex][circle2.matrixYIndex] = circle1;
  circleMatrix[circle1.matrixXIndex][circle1.matrixYIndex] = circle2;
  circle1.matrixXIndex = circle2.matrixXIndex;
  circle1.matrixYIndex = circle2.matrixYIndex;
  circle2.matrixXIndex = tmpX;
  circle2.matrixYIndex = tmpY;
};

function initSVGMatrix(){
  if($('svg').length != 0)
    $('svg').remove();

  circleMatrices = new Array(7);

  var pageWidth = $('.slide').width();
  boxWidth = 100;
  var numBoxWidthPerPage = Math.floor(pageWidth / boxWidth);
  boxWidth = pageWidth / numBoxWidthPerPage;

  var svgWidth = pageWidth * circleMatrices.length;
  var svgHeight = $('.slide').height();
  var svgTopMargin = $('header').height();
  var svgElem = Raphael($('.svg')[0], svgWidth, svgHeight);

  for(var pageNumber = 0; pageNumber < circleMatrices.length; pageNumber++){
    var contentEl = $('#page_' + (pageNumber  + 1)+ ' .content');
    if(contentEl.length > 0){
      var leftContentOffsetInBoxes = getLeftPositionOfContentInBoxes(pageNumber + 1);
      var contentWidthInBoxes = Math.ceil(contentEl.width() / boxWidth);
      var contentHeightInBoxes = Math.ceil(contentEl.height() / boxWidth);
    }
    var circleMatrix = circleMatrices[pageNumber] = new Array();

    for(var pageX = boxWidth/2; pageX < pageWidth; pageX += boxWidth){

      circleMatrix.push(new Array());

      var xArrIndex = circleMatrix.length - 1;

      for(var pageY = svgTopMargin + boxWidth/2; pageY <= svgHeight; pageY += boxWidth)
      {
        var yArrIndex = circleMatrix[xArrIndex].length;

        if(contentEl.length > 0 && xArrIndex >= leftContentOffsetInBoxes && xArrIndex  <= leftContentOffsetInBoxes + contentWidthInBoxes && yArrIndex < contentHeightInBoxes)
        {
          circleMatrix[xArrIndex].push(undefined);
          continue;
        }

        var circle = new Circle(svgElem, pageX + pageWidth*pageNumber, pageY, circleMatrix, xArrIndex, yArrIndex);
        circle.init();
        circle.setClickHandler(clickHandler);
        circle.setHoverHandler(hoverEnterHandler, hoverLeaveHandler);
        circleMatrix[xArrIndex].push(circle);
      }
    }
  }
};

function connectRandomCircle(){
  if(pathQueue.length > 5){
    var removedPathArr = pathQueue.shift();
    removedPathArr[0].removePath(removedPathArr[1], null, function(){
      removedPathArr[0].unlockColor().unlockPosition();

      if(!removedPathArr[0].hasConnectedPaths())
        removedPathArr[0].colorOff();
    });
  }

  var contentEl = $('#page_2 .content');
  var rightPositionOfContentInBoxes = getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  if(typeof lastConnectedCircle == 'undefined'){
    lastConnectedCircle = getRandomVisibleCircle(rightPositionOfContentInBoxes, 0, circleMatrix.length - rightPositionOfContentInBoxes, circleMatrix[0].length);
    lastConnectedCircle.move().lockPosition().lockColor().colorOn();
  }

  var newConnectedCircle;
  do{
    newConnectedCircle = getRandomVisibleCircle(rightPositionOfContentInBoxes, 0, circleMatrix.length - rightPositionOfContentInBoxes, circleMatrix[0].length);
  } while(newConnectedCircle.hasConnectedPaths())

  var path = lastConnectedCircle.connectNeighbourWithArc(newConnectedCircle, null, null, function(){
    newConnectedCircle.move().lockPosition().lockColor().colorOn(CONNECT_TIME);
  });

  pathQueue.push([lastConnectedCircle, path]);
  lastConnectedCircle = newConnectedCircle;
};

function blurCircles(){
  var contentEl = $('#page_2 .content');
  var rightPositionOfContentInBoxes =   getLeftPositionOfContentInBoxes(2) + Math.ceil(contentEl.width() / boxWidth);

  for(var x = 0; x < circleMatrix.length; x++){
    for(var y = 0; y < circleMatrix[x].length; y++)
    {

      if(typeof circleMatrix[x][y] == 'undefined')
        continue;

      var blur = 5 * (rightPositionOfContentInBoxes - x) / rightPositionOfContentInBoxes;
      if(blur > 0){
        circleMatrix[x][y].setBlur(blur, 3000);
        circleMatrix[x][y].desiredBlur = blur;
        circleMatrix[x][y].setHoverHandler(hoverEnterHandler, function(){
          hoverLeaveHandler.call(this);
          this.setBlur(this.desiredBlur, 1000);
        });
      }
    }
  }
};

function getRandomCircle(xOffset, yOffset, width, height){
    if(width <= 0 || height <= 0) return null;

    var randomXIndex = Math.round((width - 1)*Math.random());
    var randomYIndex = Math.round((height -1)*Math.random());

    if(xOffset + randomXIndex > circleMatrix.length ||
      yOffset + randomYIndex > circleMatrix[xOffset + randomXIndex].length)
    {
      return null;
    }

    return circleMatrix[xOffset+randomXIndex][yOffset + randomYIndex];
};

function getRandomVisibleCircle(xOffset, yOffset, width, height){
  var count = 50;
  while(count > 0){
    var randomCircle = getRandomCircle(xOffset, yOffset, width, height);

    if(randomCircle != null && typeof randomCircle != 'undefined' && randomCircle.isVisible())
        return randomCircle;

    count--;
  }

  return null;
};


function getLeftPositionOfContentInBoxes(pageNumber){
  return Math.floor(($('#page_' + pageNumber + ' .content').offset().left - $('#page_' + pageNumber).offset().left) / boxWidth);
};

var broadcastIntervalTimer;
function clickHandler(){
  if(!this.isVisible()) return;

  var that = this;

  that.clickOn = true;

  that.scale(0.5).colorOn();

  var that = this;
  if(broadcastIntervalTimer)
    clearInterval(broadcastIntervalTimer);

  that.callOnNeighbours(1, function(){startWave(that, this);});

  broadcastIntervalTimer = setInterval(function()
  {
    that.callOnNeighbours(1, function(){startWave(that, this);});
  }, 2000);
};

function startWave(pusher, pushee){
  pushee.pushedByCircle(pusher, 25*boxWidth, 100, function(){
    pushee.move(null, null, 300, null, 'easeOut');

    var currentIndexDistance = Math.max(Math.abs(pusher.matrixYIndex - pushee.matrixYIndex), Math.abs(pusher.matrixXIndex - pushee.matrixXIndex));
    pushee.callOnNeighbours(1, function(){
      var neighbourIndexDistance = Math.max(Math.abs(pusher.matrixYIndex - this.matrixYIndex), Math.abs(pusher.matrixXIndex - this.matrixXIndex));
      if(neighbourIndexDistance > currentIndexDistance)
        startWave(pusher, this);
    });
  });
};

function hoverEnterHandler(){
  if(!this.isVisible()) return;

  if(!this.clickOn)
    this.scale(1.5);

  this.lockColor().setBlur('none').colorOn();
};

function hoverLeaveHandler(){
  if(!this.isVisible()) return;

  if(this.clickOn)
    clearInterval(broadcastIntervalTimer);

  this.unlockColor().reset();
  this.clickOn = false;
};

