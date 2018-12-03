function mainScreen(datamodel) 
{
var template = `
<section class="content">
        <div class="grabber">
          <div class="col device">
            <div class="knobD">
              <svg class="svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" viewBox="0 0 1000 1000" style="enable-background:new 0 0 1000 1000;" xml:space="preserve">
                <circle class="st0" cx="500" cy="500" r="332.8">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="360 500 500"
                    dur="100s" repeatCount="indefinite" />
                </circle>
                <circle class="st1" cx="500" cy="500" r="257.7">
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="360 500 500"
                    dur="40s" repeatCount="indefinite" />
                </circle>

                <circle class="st4" cx="500" cy="500" r="180.8" transform="rotate(0 500 500)" ;>
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500"
                    dur="50s" repeatCount="indefinite" />
                </circle>
                <circle class="st2" cx="500" cy="500" r="410.8" transform="rotate(0 500 500)" ;>
                  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500"
                    dur="50s" repeatCount="indefinite" />
                </circle>
                <circle class="st3" cx="500" cy="500" r="425.1" />
                <defs>
                  <filter id="sofGlow" height="300%" width="300%" x="-75%" y="-75%">
                    <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />
                    <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
                    <feFlood flood-color="rgba(0,186,255,0.5)" result="glowColor" />
                    <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                    <feMerge>
                      <feMergeNode in="softGlow_colored" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle class="st5" cx="500" cy="500" r="430.1" style="filter:url(#sofGlow)" />
              </svg>
              <abbr><label id="percentcomplete">0</label><small>%</small></abbr>
              <span id="spnloader">
                <ul>
                  <li>E</li>
                  <li>R</li>
                  <li>A</li>
                  <li>S</li>
                  <li>E</li>
                  <li>-</li>
                  <li>D</li>
                  <li>A</li>
                  <li>T</li>
                  <li>A</li>
                </ul>
              </span>
            </div>
            <img src="./public/images/iphone.svg" class="iPhone" alt="">
            <div class="action">
              <button class="fuller-button blue" onclick="EraseData()">Erase</button>
            </div>
          </div>
          <div class="col">
            <div class="box-outer">
              <div class="info-box">
                <span class="info-box-icon bg-dark"><i class="la la-mobile"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Model Number</span>
                  <span class="info-box-number" id="modelnumber">${datamodel.modelnumber}</span>
                </div>
              </div>
            </div>
            <div class="box-outer">
              <div class="info-box">
                <span class="info-box-icon bg-dark"><i class="la la-android"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Android Version</span>
                  <span class="info-box-number" id="androidversion">${datamodel.androidversion}</span>
                </div>
              </div>
            </div>
            <div class="box-outer">
              <div class="info-box">
                <span class="info-box-icon bg-dark"><i class="la la-barcode"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Serial Number</span>
                  <span class="info-box-number" id="serialnumber">${datamodel.serialnumber}</span>
                </div>
              </div>
            </div>
            <div class="box-outer">
              <div class="info-box">
                <span class="info-box-icon bg-dark"><i class="la la-battery-3"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Power <strong><label id="lblpower">${datamodel.lblpower}</label></strong></span>
                  <div class="progress progress-sm active">
                      <div class="progress-bar progress-bar-success progress-bar-striped" id="prgpower" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:${datamodel.prgpower}"></div>
                    </div>
                </div>
              </div>
            </div>
            <div class="box-outer">
              <div class="info-box">
                <span class="info-box-icon bg-dark"><i class="la la-floppy-o"></i></span>
                <div class="info-box-content">
                  <span class="info-box-text">Phone Memory <strong><label id="lblstorage">${datamodel.lblstorage}</label></strong></span>
                    <div class="progress progress-sm active">
                        <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" style="width:${datamodel.prgstorage}" id="prgstorage" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
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