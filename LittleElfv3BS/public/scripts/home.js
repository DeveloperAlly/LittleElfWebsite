
*,*::before,*::after {
  border: 0;
  box-sizing: content-box;
  margin: 0;
  padding: 0;
}
html, body {
  color: #333;
  font-family: 'Roboto', helvetica, arial, sans-serif;
  font-weight: 400;
}
a {
  color: #555;
  text-decoration: none;
  -webkit-transition: all .5s ease-in-out;
     -moz-transition: all .5s ease-in-out;
          transition: all .5s ease-in-out;
}
a:hover {
  color: #4DBDDA;
}
article, .container, footer, header, section {
  margin: 0 auto;
  overflow: hidden;
  padding: 0;
  position: relative;
}
h2 {
  font-size: 3em;
  font-weight: 200;
  letter-spacing: 2px;
  padding: 80px 0 60px;
}
h3 {
  font-weight: 400;
  padding: 20px 0 15px;
}
h5 {
  padding: 20px 0 10px;
}
hr {
  border: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #EEE;
  padding: 60px 0 0;
}
ul {
  overflow: hidden;
  position: relative;
}
ul, li {
  display: block;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
p {
  font-weight: 100;
  padding: 6px 0 10px;
}
video, img {
  border: 0;
  display: block;
  height: auto;
  margin: 0 auto;
  object-fit: cover;
  padding: 0;
  width: initial;
}
iframe {
  height: 100%;
  width: 100%;
}
.container {
  text-align: center;
}
.container p {
  max-width: 640px;
  margin: 0 auto;
  padding: 10px 0 40px;
}
.container hr {
  margin: 0 10% 0;
}
.flex {
  margin: 0 auto;
  overflow: hidden;
  padding: 60px 0 40px;
  position: relative;
  width: initial;
}
.flex > .box {
  display: inline-block;
  margin: 0 auto;
  padding: 20px 0;
  width: initial;
}
.flex > .box > p {
  max-width: initial;
  padding: 20px 10px;
}
.btn-scroll {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.35);
  border-radius: 50%;
  bottom: 80px;
  color: #FFF;
  font-size: 2em;
  height: 40px;
  left: 0;
  margin: 0 auto;
  overflow: hidden;
  padding: 10px;
  position: absolute;
  right: 0;
  text-align: center;
  width: 40px;
  z-index: 9992;
}
.btn-scroll:hover {
  border: 2px solid #FFF;
  color: #FFF;
}
.btn-scroll span {
	display: inline-block;
	-webkit-animation: next-section-bounce 2s infinite;
	   -moz-animation: next-section-bounce 2s infinite;
	        animation: next-section-bounce 2s infinite;
}
.btn-scroll:hover {
	cursor: pointer;
	border-color: #FFF;
	color: #FFF;
}
.btn-scroll:hover span {
	-webkit-animation: 0s infinite;
	   -moz-animation: 0s infinite;
          animation: 0s infinite;
}
@-webkit-keyframes next-section-bounce {
    0% {
    	-webkit-transform: translateY(5px);
    	opacity: 0.8;
    }
    50% {
    	-webkit-transform: translateY(-5px);
    	opacity: 1;
    }
    100% {
    	-webkit-transform: translateY(5px);
    	opacity: 0.8;
    }
}
@-moz-keyframes next-section-bounce {
    0% {-moz-transform: translateY(5px);}
    50% {-moz-transform: translateY(-5px);}
    100% {-moz-transform: translateY(5px);}
}
@keyframes next-section-bounce {
    0% {transform: translateY(5px);}
    50% {transform: translateY(-5px);}
    100% {transform: translateY(5px);}
}
.btn-link {
  overflow: hidden;
  padding: 20px 0 10px;
  position: absolute;
}
.btn-link span {
  background: #FFF;
  margin: 20px auto 10px;
  padding: 12px 10px;
}
.content {
  margin: 0 auto;
  overflow: 0;
  padding: 0;
  position: relative;
}
#intro .container {
  width: initial;
}
#aditions {
  background: #2B879E;
  color: #FFF;
  padding: 40px 0 80px;
}
#aditions .box {
  text-align: left;
}
#aditions h3, #aditions h5 {
  font-weight: 100;
}
#aditions p {
  font-size: 14px;
  padding: 0 0 8px;
}
#portafolio {
  background-image: url('https://goo.gl/LSESHT');
  background-position: center;
  background-size: cover;
  padding: 0 0 60px;
  position: relative;
}
#portafolio article {
  display: inline-block;
  margin: 0 -2px;
  vertical-align: middle;
}
#portafolio article,
#portafolio figure,
#portafolio figcaption,
#portafolio figure img {
  height: 320px;
  width: 100%;
}
#portafolio figure, #portafolio figcaption {
  color: #FFF;
  margin: 0;
  overflow: hidden;
  padding: 0;
  position: relative;
}
#portafolio figcaption {
  color: #FFF;
  display: inline-block;
  left: 0;
  position: absolute;
  top: -100%;
  vertical-align: middle;
  -webkit-transition: all .5s ease-in-out;
     -moz-transition: all .5s ease-in-out;
          transition: all .5s ease-in-out;
}
#portafolio h3 {
  margin: 140px 10px 10px;
}
#portafolio .content a {
  color: #FFF;
}
#portafolio article:hover figcaption {
  background: rgba(43, 135, 158, 0.85);
  top: 0;
}
#blog {
  background-image: url('https://goo.gl/jBr9v4');
  background-position: center;
  background-size: cover;
  padding: 20px 0 60px;
}
#blog:after {
  background: #2B879E;
  content: "";
  opacity: .56;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100.1%;
  z-index: 1;
}
#blog h2 {
  color: #FFF;
  font-weight: 400;
  z-index: 2;
}
#blog .container {z-index: 2;}
#blog li {
  width: 100%;
}
  #blog figure, #blog figcaption {
    background: #FFF;
    margin: 0;
    padding: 0;
  }
  #blog figure, #blog figure img {
    height: 240px;
    width: 100%;
  }
  #blog figcaption {
    padding: 10px;
  }
#blog ul {
  list-style: none;
  margin: 0 auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-bottom: 150px;
  margin-bottom: 10px;
  margin: 0;
}
  #blog li {
    display: block;
    margin: 1em auto 2em;
    margin-left: 120px;
    position: relative;
    width: calc(100% - 120px);
  }
#blog span.date-time {
  display: block;
  margin-left: -100px;
  position: absolute;
  right: auto;
  top: 50px;
  text-align: center;
  color: #FFF;
  z-index: 10;
  line-height: 1;
}
#blog span.date-time > span {
  display: block;
  position: relative;
  width: 100%;
}
#blog span.date-time span:first-child {
  font-size: 4em;
}
#blog span.date-time span {
  font-size: 1em;
}
#blog span.date-time span:last-child {
  font-size: 1.5em;
}
#blog span.bullet {
  display: inline-block;
  position: absolute;
  right: auto;
  top: 93px;
  text-align: center;
  background-color: #FFF;
  z-index: 10;
  line-height: 1;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
#blog span.bullet {display: none}
#blog .loadmore {
  position: absolute;
  left: 50%;
  bottom: 0;
  background-color: #FFF;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  text-align: center;
  margin-left: -22px;
  color: #222;
  font-size: 2rem;
  line-height: 2.5rem;
  padding: 2px;
}
#blog .loadmore:hover {
  background: #2B879E;
  color: #FFF;
}
#clients {
  color: #FFF;
  background-color: #464646;
  padding: 60px 0;
  background: url(https://goo.gl/7EPhUS) no-repeat center center;
  background-size: cover;
}
#clients:after {
  background-color: #2B879E;
  opacity: 0.35;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100.1%;
  z-index: 1;
}
#clients .container {z-index: 2}
#clients .slide {
  margin: 0;
  text-align: left;
  width: 2340px;
}
#clients .slide .box {
  display: inline-block;
  height: 170px;
  width: 230px;
}
#clients .slide img {
  height: auto;
  margin: 0 auto;
  object-fit: inherit;
  width: 160px;
}
#clients .slide-controls {
  height: 40px;
  margin: 40px auto 10px;
  position: relative;
}
#clients .slide-controls .btn {
  font-size: 2em;
  position: absolute;
  width: 40px;
  height: 40px;
  color: #FFF;
  border: 1px solid rgba(255,255,255,.45);
  text-align: center;
  cursor: pointer;
}
#clients .slide-controls .btn:hover {
  background: #2B879E;
  border: 0;
  color: #FFF;
}
#clients .btn.l {
  left: 50%;
  margin-left: -50px;
  border-radius: 50%;
}
#clients .btn.r {
  left: 50%;
  margin-right: -50px;
  border-radius: 50%;
}

@media only screen and (min-width: 700px){
  .container {width: 700px}
  .flex > .box {width: 48%}
  #aditions .flex > .box {width: 48%;}
  #portafolio article,
  #portafolio figure,
  #portafolio figcaption,
  #portafolio figure img {
    height: 320px;
    width: 320px;
  }
}
@media only screen and (min-width: 900px){
  .container {width: 900px}
  .flex > .box {width: 32%}
  #blog ul::before {
    background: #FFF;
    content: "";
    left: 50%;
    top: 0;
    bottom: 0;
    position: absolute;
    width: 1px;
    margin-left: 0;
    margin-top: -10px;
    height: 9999px;
  }
  #blog figure, #blog figcaption {
    background: #FFF;
    margin: 0;
    padding: 0;
  }
  #blog figure, #blog figure img {
    height: 240px;
    width: 100%;
  }
  #blog figcaption {
    padding: 10px;
  }
  #blog li {
    display: block;
    position: relative;
    width: 46%;
  }
  #blog li:nth-child(odd){
    clear: both;
    float: left;
    margin: 1em auto 2em 0;
    padding: 0 4% 0 0;
  }
  #blog li:nth-child(odd) > span.date-time {
    right: 0;
    margin: 0 -100px 0 auto;
  }
  #blog li:nth-child(odd) > span.bullet {
    right: 0;
    margin: 0 -13px 0 auto;
  }
#blog span.bullet {display: block}
  #blog li:nth-child(even){
    clear: both;
    float: right;
    margin: 1em auto 2em 0;
    padding: 0 0 0 4%;
  }
  #blog li:nth-child(even) > span.date-time {
    left: 0;
    margin: 0 auto 0 -100px;
  }
  #blog li:nth-child(even) > span.bullet {
    left: 0;
    margin: 0 auto 0 -13px;
  }
  #blog h3 {padding: 0 0 10px;}
  #blog p {font-size: 1em;}
}

@media only screen and (min-width: 1020px){
  .container {width: 1000px}
  .flex > .box {width: 32%}
  #blog h3 {padding: 0 0 10px;}
  #blog p {font-size: 0.875em;}
}
@media only screen and (max-width: 500px) {
  #blog li > span.date-time {display: none}
  #blog ul > li {
    margin: 0 10px 2em;
    width: calc(100% - 20px);
  }
}
