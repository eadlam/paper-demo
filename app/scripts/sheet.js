'use strict';

angular.module('paperApp').service('ProjectMap', function($resource){
  var data = [
    {
      location:[165,150],
      color:'green',
      text: 'learn how grouping works'
    },
    {
      location:[165,350],
      color:'green',
      text: 'be able to add nodes'
    },
    {
      location:[565,100],
      color:'blue',
      text: 'create a mock json file'
    },
    {
      location:[565,250],
      color:'blue',
      text: 'be able to edit text'
    },
    {
      location:[565,400],
      color:'blue',
      text: 'add arrows between nodes'
    },
    {
      location:[965,150],
      color:'red',
      text: 'add business sections'
    },
    {
      location:[965,350],
      color:'red',
      text: 'add section divider lines'
    }
  ];

  return {
    all: function(){
      return data;
    }
  };
});

angular.module('paperApp').directive('sheet', function(ProjectMap) {

  // These declarations are mostly to appease jsHint
  var $ = window.$;
  var paper = window.paper;

  var TEXT_COLOR = 'black';
  var TEXT_MARGIN = 40;
  var TEXT_ALIGN = 'center';
  var RADIUS = 20;

  // panning and zooming functions. Adapted from:
  // http://matthiasberth.com/articles/stable-zoom-and-pan-in-paperjs/

  var simpleZoom = function(oldZoom, delta){
      // This determines the speed/sensitivity of the zoom 
      // 1.00 produces no zoom.
      // 1.01 produces a slow zoom
      // 1.03 -> 1.05 produces a good natural zoom
      var factor = 1.03;

      // Calculate and return the new zoom
      var zoom = oldZoom;
      if(delta < 0){
        zoom = oldZoom * factor;
      } else if(delta > 0){
        zoom = oldZoom / factor;
      }
      return zoom;
  };

  var changeCenter = function(oldCenter, deltaX, deltaY, factor){
      var offset = new paper.Point(deltaX, -deltaY);
      offset = offset.multiply(factor);
      return oldCenter.add(offset);
  };

  var stableZoom = function(oldZoom, delta, c, p){
    var newZoom = simpleZoom(oldZoom, delta);
    var beta = oldZoom / newZoom;
    var pc = p.subtract(c);
    var a = p.subtract(pc.multiply(beta)).subtract(c);
    return {zoom:newZoom, offset:a};
  };

  // This is where the directive accessess the DOM element
  var link = function(scope, element, attrs){

    console.log(element, attrs);
    
    var canvas = element.context.firstChild;
    paper.setup(canvas);

    // fetch data
    var items = ProjectMap.all();

    // Add items to the canvas
    for(var item in items){
      var d = items[item];
      new paper.Path.Circle({center: d.location, radius: RADIUS, fillColor: d.color});
      var p = new paper.Point(d.location[0],d.location[1] + TEXT_MARGIN);
      var text = new paper.PointText(p);
          text.justification = TEXT_ALIGN;
          text.fillColor = TEXT_COLOR;
          text.content = d.text;
      paper.view.draw();
    }

    // Handle scroll wheel events to pan and zoom
    // TODO: implement as a native paper tool
    $(canvas).mousewheel(function(event){
        if(event.shiftKey){ // panning
          event.preventDefault();
          paper.view.center = changeCenter(paper.view.center, 
                                           event.deltaX, 
                                           event.deltaY, 
                                           event.deltaFactor);
          paper.view.draw();

        } else if(event.altKey){ // zooming
          event.preventDefault();
          var mousePosition = new paper.Point(event.offsetX, event.offsetY);
          var viewPosition = paper.view.viewToProject(mousePosition);
          var zoomParams = stableZoom(paper.view.zoom, 
                                      event.deltaY, 
                                      paper.view.center, 
                                      viewPosition);
          paper.view.zoom = zoomParams.zoom;
          paper.view.center = paper.view.center.add(zoomParams.offset);
          paper.view.draw();
        }
    });
 

    // Handle click and drag events to pan and zoom
    var tool = new paper.Tool();

    var hitOptions = {
      segments: false,
      stroke: false,
      fill: true,
      tolerance: 5
    };

    var path;
    var movePath = false;
    tool.onMouseDown = function(event) {
      console.log(event);
      path = null;
      var hitResult = paper.project.hitTest(event.point, hitOptions);
      
      if (!hitResult){
        return;
      } else if (hitResult) {
        console.log(hitResult);
        path = hitResult.item;
        console.log(path);
      }

      movePath = hitResult.type === 'fill';
      if (movePath){
        paper.project.activeLayer.addChild(hitResult.item);
      }
    };

    tool.onMouseMove = function(event) {
      paper.project.activeLayer.selected = false;
      if (event.item){
        event.item.selected = true;
      }
    };

    tool.onMouseDrag = function(event) {
      if(path){
        path.position = event.point;
      }
    };

  };

  return {
    restrict: 'EA',
    template: '<canvas resize><h1>test</h1></canvas>',
    link: link
  };
});