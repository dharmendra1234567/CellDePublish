function deviceStorageScreen(dataModel) {
    var template = `
<section class="content">
      <div class="grabber">        
        <div class="col device">
            <div class="knobD">
                <svg class="svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px" y="0px" viewBox="0 0 1000 1000" style="enable-background:new 0 0 1000 1000;" xml:space="preserve">
                  <!-- Stroke ring -->
                  <circle class="st0" cx="500" cy="500" r="332.8">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="100s"
                      repeatCount="indefinite" />
                  </circle>
                  <!-- Inner ring -->
                  <circle class="st1" cx="500" cy="500" r="257.7">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="40s"
                      repeatCount="indefinite" />
                  </circle>

                  <circle class="st4" cx="500" cy="500" r="180.8" transform="rotate(0 500 500)" ;>
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500"
                      dur="50s" repeatCount="indefinite" />
                  </circle>

                  <!-- Outer ring -->
                  <circle class="st2" cx="500" cy="500" r="410.8" transform="rotate(0 500 500)" ;>
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500"
                      dur="50s" repeatCount="indefinite" />
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
              <abbr>${dataModel.storagePercent}<small>%</small></abbr>
              <span>
                  <ul>
                      <li>M</li>
                      <li>E</li>
                      <li>M</li>
                      <li>O</li>
                      <li>R</li>
                      <li>Y</li>
                      <li>&nbsp;</li>
                      <li>U</li>
                      <li>S</li>
                      <li>E</li>
                      <li>D</li>                      
                    </ul>
                </span>
            </div>
            <img src="./public/images/android.svg" class="iPhone" alt="">
            <div class="action">
                <button class="fuller-button blue">Erase</button>
             </div>
        </div>
        <div class="col multiple-boxs">
          <div class="row">
            <div class="col-sm-6">
              <div class="box-outer">
                <div class="info-box">
                  <span class="info-box-icon bg-dark"><i class="fa fa-address-card-o"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Contacts</span>
                    <span class="info-box-number">200</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="box-outer">
                <div class="info-box">
                  <span class="info-box-icon bg-dark"><i class="la la-cubes"></i></span>
                  <div class="info-box-content">
                    <span class="info-box-text">Apps</span>
                    <span class="info-box-number">25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
              <div class="col-sm-6">
                <div class="box-outer">
                  <div class="info-box">
                    <span class="info-box-icon bg-dark"><i class="la la-photo"></i></span>
                    <div class="info-box-content">
                      <span class="info-box-text">Photos</span>
                      <span class="info-box-number">10</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="box-outer">
                  <div class="info-box">
                    <span class="info-box-icon bg-dark"><i class="la la-file-video-o"></i></span>
                    <div class="info-box-content">
                      <span class="info-box-text">Videos</span>
                      <span class="info-box-number">250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                  <div class="box-outer">
                    <div class="info-box">
                      <span class="info-box-icon bg-dark"><i class="la la-music"></i></span>
                      <div class="info-box-content">
                        <span class="info-box-text">Songs</span>
                        <span class="info-box-number">20</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="box-outer">
                    <div class="info-box">
                      <span class="info-box-icon bg-dark"><i class="la la-sticky-note"></i></span>
                      <div class="info-box-content">
                        <span class="info-box-text">Notes</span>
                        <span class="info-box-number">25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-sm-6">
                    <div class="box-outer">
                      <div class="info-box">
                        <span class="info-box-icon bg-dark"><i class="la la-comments"></i></span>
                        <div class="info-box-content">
                          <span class="info-box-text">Messages</span>
                          <span class="info-box-number">20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="box-outer">
                      <div class="info-box">
                        <span class="info-box-icon bg-dark"><i class="la la-repeat"></i></span>
                        <div class="info-box-content">
                          <span class="info-box-text">Cache</span>
                          <span class="info-box-number">250 mb</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
      </div>      
      
      
    </section>
`
    $("body").removeClass('sidebar-disable');
    $("#mainContent").empty();
    $("#mainContent").html(template);

}