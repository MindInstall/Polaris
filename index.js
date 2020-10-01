// Preview uploaded image
function preview_image(event) 
{
 var reader = new FileReader();
 reader.onload = function()
 {
  var output = document.getElementById('output_image');
  output.src = reader.result;
 }
 reader.readAsDataURL(event.target.files[0]);
}

// Preview uploaded image
function preview_image1(event) 
{
 var reader = new FileReader();
 reader.onload = function()
 {
  var output1 = document.getElementById('output_image1');
  output1.src = reader.result;
 }
 reader.readAsDataURL(event.target.files[0]);
}