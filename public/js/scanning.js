function scanDeviceScreen() 
{
var template = `
<section class="content">
<div class="grabber">        
  <div class="col device">
      <div class="knobD scan">                                
          <svg class="svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px" y="0px" viewBox="0 0 1000 1000" style="enable-background:new 0 0 1000 1000;" xml:space="preserve">
          <!-- Stroke ring -->
          <circle class="st0" cx="500" cy="500" r="332.8">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="10s" repeatCount="indefinite" />
          </circle>
          <!-- Inner ring -->
          <circle class="st1" cx="500" cy="500" r="257.7">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="5s" repeatCount="indefinite" />
          </circle>

          <circle class="st4" cx="500" cy="500" r="180.8" transform="rotate(0 500 500)" ;>
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite" />
          </circle>

          <!-- Outer ring -->
          <circle class="st2" cx="500" cy="500" r="410.8" transform="rotate(0 500 500)" ;>
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="10s" repeatCount="indefinite" />
          </circle>
          <!-- Outer thin ring -->
          <circle class="st3" cx="500" cy="500" r="425.1" />
          
          <defs>
            <filter id="sofGlow" height="300%" width="300%" x="-75%" y="-75%">                      
              <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />
              <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
              <feFlood flood-color="rgba(0,186,255,0.5)" result="glowColor" />
              <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
              <feMerge>
                <feMergeNode in="softGlow_colored"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>                  
          </defs>

          <circle class="st5" cx="500" cy="500" r="430.1" style="filter:url(#sofGlow)"/>
          
        </svg>
      <abbr>54<small>%</small></abbr>
        <span>
            <ul>                      
                <li>S</li>
                <li>C</li>
                <li>A</li>
                <li>N</li>
                <li>N</li>
                <li>I</li>
                <li>N</li>
                <li>G</li>                      
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
      <img src="./public/images/android.svg" class="android" alt="">            
  </div>

</div>      
</section>
`
$("body").addClass('sidebar-disable');
$("#mainContent").empty();
$("#mainContent").html(template);

}