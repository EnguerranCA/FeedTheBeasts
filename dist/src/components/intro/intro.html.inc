<!-- title -->
<a-entity position="0 4 -10" rotation="" scale="">
  <a-text
    position="0 3 0.2"
    value="Welcome to"
    color="#FFFFFF"
    width="40"
    align="center"
  ></a-text>
  <a-text
    position="0 0 0.2"
    value="Let Him Quizz!"
    color="#FFFFFF"
    width="60"
    align="center"
    font-weight="bold"
  ></a-text>
  <a-box
    position="0 1 0"
    depth="0.2"
    height="6"
    width="22"
    color="#8f8f8f"
    opacity="1"
  ></a-box>
</a-entity>

<!-- rules -->
<a-box
  position="-0.889 5.089 -22.61737"
  depth="0.2"
  height="6"
  width="22"
  color="#8f8f8f"
  opacity="0.8"
  material="color: #1a1a1a"
  scale="0.71 2.32 1"
  rotation=""
></a-box>
<a-text
  position="-0.889 10.67861 -22.01149"
  value="Rules"
  color="#FFFFFF"
  width="40"
  align="center"
></a-text>
<a-text
  position="-0.889 7.95148 -22.01149"
  value="1. Answer the questions"
  color="#FFFFFF"
  width="30"
  align="center"
></a-text>
<a-text
  position="-0.889 5.85535 -22.01149"
  value="2. Collect the money"
  color="#FFFFFF"
  width="30"
  align="center"
></a-text>
<a-text
  position="-0.889 3.51863 -22.01149"
  value="3. Enjoy the show"
  color="#FFFFFF"
  width="30"
  align="center"
></a-text>
<a-box
  position="0 0.37678 -22.52576"
  depth="0.5"
  height="1"
  width="3"
  color="#00FF00"
  opacity="0.8"
  class="clickable"
  event-set__mouseenter="_event: mouseenter; color: #FF0000"
  event-set__mouseleave="_event: mouseleave; color: #00FF00"
  event-set__click="_event: click; _target: #mainScene; visible: false"
>
  <a-text
    value="Play"
    align="center"
    color="#FFFFFF"
    width="4"
    position="0 0 0.3"
  ></a-text>
</a-box>
