<a-entity
      animation__position="property: position; to: 0.99 2 -36; dur: 500; easing: linear;"
      animation__scale="property: scale; to: 1.03 1.02 1.03; dur: 1500; easing: easeInOutQuad; loop: true; dir: alternate;"
      id="explanationZone"
      position="0.99 0 -36"
    >
    <a-entity id="explanation-screen" position="0 2 -3">
      <a-text
        align="center"
        value="{{explanation}}"
        color="#FFF"
        position="0 -0.5 0.1"
      ></a-text>
    </a-entity>
    <a-entity position="0.60 1.5 -1.5" rotation="-30 0 0">
    <a-text
    position="-0.5 -1.5 0.15"

        value="Start"
        align="center"
        color="#FFF"
        scale="0.8 0.8 0.8"
        rotation="0 0 0"
    >
    </a-text>
    <a-box
        position="-0.5 -1.5 0"
        class="interactable"
        id="validButton-explanation"
        depth="0.1"
        height="0.3"
        width="1"
        color="#FF662F"
        rotation="0 0 0"
    >
    </a-box>
    </a-entity>
</a-entity>