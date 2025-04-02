// DrawTriangle.js (c) 2012 matsuda
// import Vector3 from 'cuon-matrix-cse160.js';

function drawVector(vector, color){
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 
  var ctx = canvas.getContext('2d');

  // Scale up for visibility
  let startX = canvas.width / 2; // Start at the center of the canvas
  let startY = canvas.height / 2;
  let endX = startX + vector.elements[0] * 20;
  let endY = startY - vector.elements[1] * 20; // Invert Y since canvas uses top-left origin

  ctx.beginPath();  
  ctx.moveTo(startX, startY); // Move to the origin (or another start point)
  ctx.lineTo(endX, endY); // Draw line to the vector position
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke(); // Actually render the line
}

function main() {  
  
}

function handleDrawEvent(){
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  var xv1 = document.getElementById('xv1').value;  
  if (!xv1) { 
    console.log('Failed to get input v1 x');
    return false; 
  } 

  var yv1 = document.getElementById('yv1').value;  
  if (!yv1) { 
    console.log('Failed to get input v1 y');
    return false; 
  } 

  var xv2 = document.getElementById('xv2').value;  
  if (!xv2) { 
    console.log('Failed to get input v2 x');
    return false; 
  } 

  var yv2 = document.getElementById('yv2').value;  
  if (!yv2) { 
    console.log('Failed to get input v2 y');
    return false; 
  } 

  var v1 = new Vector3([xv1, yv1, 0]);
  var v2 = new Vector3([xv2, yv2, 0]);

  drawVector(v1, 'red');
  drawVector(v2, 'blue');

  var op = document.getElementById('operation').value; 
  
  if (!op) { 
    console.log('Failed to get the operation');
    return false; 
  }

  if(op == 'add'){
    var v3 = new Vector3([0, 0, 0]);
    v3.set(v1)
    v3.add(v2);
    drawVector(v3, 'green');
  }
  else if(op == 'subtract'){
    var v3 = new Vector3([0, 0, 0]);
    v3.set(v1)
    v3.sub(v2);
    drawVector(v3, 'green');
  }
  else if(op == 'multiply'){
    var scalar = document.getElementById('scalar').value; 
  
    if (!scalar) { 
      console.log('Failed to get the scalar');
      return false; 
    }
    var v3 = new Vector3([0, 0, 0]);
    v3.set(v1)
    v3.mul(scalar);

    var v4 = new Vector3([0, 0, 0]);
    v4.set(v2)
    v4.mul(scalar);

    drawVector(v3, 'green');
    drawVector(v4, 'green');
  }
  else if(op == 'divide'){
    var scalar = document.getElementById('scalar').value; 
  
    if (!scalar) { 
      console.log('Failed to get the scalar');
      return false; 
    }

    var v3 = new Vector3([0, 0, 0]);
    v3.set(v1)
    v3.div(scalar);

    var v4 = new Vector3([0, 0, 0]);
    v4.set(v2)
    v4.div(scalar);

    drawVector(v3, 'green');
    drawVector(v4, 'green');
  }
  else if(op=='magnitude'){
    var v1mag = v1.magnitude();
    var v2mag = v2.magnitude();

    console.log('Magnitude v1: ' + v1mag);
    console.log('Magnitude v2: ' + v2mag);
  }
  else if(op =='normalize'){
    var v3 = new Vector3([0, 0, 0]);
    v3.set(v1)
    v3.normalize();

    var v4 = new Vector3([0, 0, 0]);
    v4.set(v2)
    v4.normalize();

    drawVector(v3, 'green');
    drawVector(v4, 'green');
  }
  else if(op=='angle'){
    var dot = Vector3.dot(v1, v2);

    let costheta=dot/(v1.magnitude()*v2.magnitude());
    let theta = Math.acos(costheta); // in radians
    let angle = theta * (180 / Math.PI); // convert to degrees
    console.log('Angle: ' + angle);

  }
  else if(op=='area'){
    var v3 = Vector3.cross(v1, v2);
    var area = v3.magnitude();

    console.log('Area: ' + area * .5);
  }

}