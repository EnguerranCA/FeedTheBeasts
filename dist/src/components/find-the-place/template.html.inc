<a-entity
  animation__position="property: position; to: 0.99 2 -36;delay:1500; dur: 500; easing: linear;"
  animation__scale="property: scale; to: 1.03 1.02 1.03; dur: 1500; easing: easeInOutQuad; loop: true; dir: alternate;"
  id="propositionsZone"
  position="0.99 -3 -36"
>
  <a-entity id="question" position="0 2 -3">
    <a-text
      align="center"
      value="Where is this place ?"
      color="#FFF"
      position="0 0 0.1"
    ></a-text>
  </a-entity>

  <a-entity class="answer" id="answer1" position="-1 1 -3">
    <a-text
      align="center"
      value="Answer 1"
      color="#FFF"
      position="0 0 0.1"
    ></a-text>
    <a-box
      position="0 0 0"
      class="interactable"
      depth="0.1"
      height="0.5"
      width="1.8"
      color="#FF662F"
    ></a-box>
  </a-entity>
  <a-entity class="answer" id="answer2" position="1 1 -3">
    <a-text
      align="center"
      value="Answer 2"
      color="#FFF"
      position="0 0 0.1"
    ></a-text>
    <a-box
      position="0 0 0"
      class="interactable"
      depth="0.1"
      height="0.5"
      width="1.8"
      color="#FF662F"
    ></a-box>
  </a-entity>
  <a-entity class="answer" id="answer3" position="-1 0 -3">
    <a-text
      align="center"
      value="Answer 3"
      color="#FFF"
      position="0 0 0.1"
    ></a-text>
    <a-box
      position="0 0 0"
      class="interactable"
      depth="0.1"
      height="0.5"
      width="1.8"
      color="#FF662F"
    ></a-box>
  </a-entity>
  <a-entity class="answer" id="answer4" position="1 0 -3">
    <a-text
      align="center"
      value="Answer 4"
      color="#FFF"
      position="0 0 0.1"
    ></a-text>
    <a-box
      position="0 0 0"
      class="interactable"
      depth="0.1"
      height="0.5"
      width="1.8"
      color="#FF662F"
    ></a-box>
  </a-entity>
</a-entity>
