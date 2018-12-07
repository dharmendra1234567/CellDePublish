function connectDeviceScreen() 
{

var template = `
<section class="content">
<div class="grabber">        
  <div class="col device">
      <div class="knobD">                                
        <span>
            <ul>                      
                <li>C</li>
                <li>O</li>
                <li>N</li>
                <li>N</li>
                <li>E</li>
                <li>C</li>
                <li>T</li>                      
              </ul>                    
          </span>
          <span>
              <ul>
                  <li>Y</li>
                  <li>O</li>
                  <li>U</li>
                  <li>R</li>                        
              </ul>
          </span>
          <span>
             <ul>
              <li>D</li>
              <li>E</li>
              <li>V</li>
              <li>I</li>
              <li>C</li>
              <li>E</li>                      
            </ul>
          </span>
      </div>
      <div class="alert">
          <svg width="14px" height="60px" class="line line-1">
            <path d="M2,58 C14,45 14,15 2,2"></path>
          </svg>
          <svg width="14px" height="60px" class="line line-2">
            <path d="M2,58 C14,45 14,15 2,2"></path>
          </svg>
          <svg width="14px" height="60px" class="line line-3">
            <path d="M2,58 C14,45 14,15 2,2"></path>
          </svg>
          <svg width="14px" height="60px" class="line line-4">
            <path d="M12,58 C0,45 0,15 12,2"></path>
          </svg>
          <svg width="14px" height="60px" class="line line-5">
            <path d="M12,58 C0,45 0,15 12,2"></path>
          </svg>
          <svg width="14px" height="60px" class="line line-6">
            <path d="M12,58 C0,45 0,15 12,2"></path>
          </svg>
          
        </div>
        <i class="la la-info-circle usb-info" data-toggle="modal" data-target="#myModal" title="How to enable usb debugging" data-placement="right"></i>
      <img src="./public/images/connector.svg" class="connector" alt="">            
  </div>

</div>      


</section>



`
$("body").addClass('sidebar-disable');
$("#mainContent").empty();
$("#mainContent").html(template);
setTimeout(() => {
$('.usb-info').tooltip({
  template: '<div class="tooltip info"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
}).tooltip('show');
},500);
}