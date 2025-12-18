<a-entity id="sorrynotsorich-container">
  <a-asset-item
    id="moneyDropTableModel"
    src="./src/assets/modele3d/moneydroptable.glb"
  ></a-asset-item>
  <a-entity
    gltf-model="#moneyDropTableModel"
    position="1.1 0.2 -38.14591"
    scale="0.65 0.65 0.65"
    rotation="0 90 0"
    material="metalness: 1; roughness: 1; specular: #fff; shader: standard"
  ></a-entity>

  <a-entity id="question" position="0 2.5 -3">
    <a-text
      align="center"
      value="Where is this place ?"
      color="#FFF"
      position="0.99 1 -36.1"
    ></a-text>
  </a-entity>

  <a-entity class="answer" id="answer1" position="-1 1 -3">
    <a-text
      align="center"
      value="Answer 1"
      color="#FFF"
      position="-0.55 0.54 -35.45"
    ></a-text>
    <a-box
      position="-0.55 0.54 -35.5"
      depth="0.001"
      height="0.95"
      width="1.642"
      color="#3246E7"
      rotation="-16 0 0"
    ></a-box>
  </a-entity>
  <a-entity class="answer" id="answer2" position="1 1 -3">
    <a-text
      align="center"
      value="Answer 2"
      color="#FFF"
      position="-0.81 0.54 -35.45"
      scale="0.85 0.85 0.85"
    ></a-text>

    <a-box
      position="-0.81 0.54 -35.5"
      depth="0.001"
      height="0.95"
      width="1.642"
      color="#3246E7"
      rotation="-16 0 0"
    ></a-box>
  </a-entity>
  <a-entity class="answer" id="answer3" position="1 1 -3">
    <a-text
      align="center"
      value="Answer 3"
      color="#FFF"
      position="0.95 0.54 -35.45"
      scale="0.85 0.85 0.85"
    ></a-text>
    <a-box
      position="0.95 0.54 -35.5"
      depth="0.001"
      height="0.95"
      width="1.642"
      color="#3246E7"
      rotation="-16 0 0"
    ></a-box>
  </a-entity>
  <a-entity class="answer" id="answer4" position="1 1 -3">
    <a-text
      align="center"
      value="Answer 4"
      color="#FFF"
      position="2.75 0.54 -35.45"
      scale="0.85 0.85 0.85"
    ></a-text>
    <a-box
      position="2.75 0.54 -35.5"
      depth="0.001"
      height="0.95"
      width="1.642"
      color="#3246E7"
      rotation="-16 0 0"
    ></a-box
  ></a-entity>
  <a-entity class="plusminus" id="plusminus1" position="1.5 2.75 -4.5">
    <a-entity id="plus1">
      <a-text
        align="center"
        value="+"
        color="#FFF"
        position="-2.5 -0.25 -33.9"
        scale="1.4 1.4 1.4"
      >
      </a-text>
      <a-box
        class="interactable"
        position="-2.5 -0.25 -34"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#A3E447"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
    <a-entity id="minus1">
      <a-text
        value="-"
        align="center"
        color="#FFF"
        position="-3.3 -0.25 -33.9"
        scale="1.6 1.6 1.6"
      >
      </a-text>
      <a-box
        class="interactable"
        position="-3.3 -0.25 -34"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#FF0000"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
  </a-entity>

  <a-entity class="plusminus" id="plusminus2" position="3.15 2.75 -4.5">
    <a-entity id="plus2">
      <a-text
        align="center"
        value="+"
        color="#FFF"
        position="-2.5 -0.25 -33.9"
        scale="1.4 1.4 1.4"
      >
      </a-text>
      <a-box
        position="-2.5 -0.25 -34"
        class="interactable"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#A3E447"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
    <a-entity id="minus2">
      <a-text
        value="-"
        align="center"
        color="#FFF"
        position="-3.3 -0.25 -33.9"
        scale="1.6 1.6 1.6"
      >
      </a-text>
      <a-box
        position="-3.3 -0.25 -34"
        class="interactable"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#FF662F"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
  </a-entity>

  <a-entity class="plusminus" id="plusminus3" position="4.75 2.75 -4.5">
    <a-entity id="plus3">
      <a-text
        align="center"
        value="+"
        color="#FFF"
        position="-2.5 -0.25 -33.9"
        scale="1.4 1.4 1.4"
      >
      </a-text>
      <a-box
        position="-2.5 -0.25 -34"
        class="interactable"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#A3E447"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
    <a-entity id="minus3">
      <a-text
        value="-"
        align="center"
        color="#FFF"
        position="-3.3 -0.25 -33.9"
        scale="1.6 1.6 1.6"
      >
      </a-text>
      <a-box
        position="-3.3 -0.25 -34"
        class="interactable"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#FF662F"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
  </a-entity>

  <a-entity class="plusminus" id="plusminus4" position="6.50 2.75 -4.5">
    <a-entity id="plus4">
      <a-text
        align="center"
        value="+"
        color="#FFF"
        position="-2.5 -0.25 -33.9"
        scale="1.4 1.4 1.4"
      >
      </a-text>
      <a-box
        position="-2.5 -0.25 -34"
        class="interactable"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#A3E447"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
    <a-entity id="minus4">
      <a-text
        value="-"
        align="center"
        color="#FFF"
        position="-3.3 -0.25 -33.9"
        scale="1.6 1.6 1.6"
      >
      </a-text>
      <a-box
        position="-3.3 -0.25 -34"
        class="interactable"
        depth="0.1"
        height="0.35"
        width="0.35"
        color="#FF662F"
        scale="1.2 1.2 1.2"
      >
      </a-box>
    </a-entity>
  </a-entity>

  <a-entity id="dollarBet" position="6.50 1.0 -4.5">
    <a-text
      id="bet1"
      value="0$"
      align="center"
      color="#A3E447"
      position="-8.3 -0.25 -32.5"
      scale="1 1 1"
    >
    </a-text>
    <a-text
      id="bet2"
      value="0$"
      align="center"
      color="#A3E447"
      position="-6.3 -0.25 -32.5"
      scale="1 1 1"
    >
    </a-text>
    <a-text
      id="bet3"
      value="0$"
      align="center"
      color="#A3E447"
      position="-4.5 -0.25 -32.5"
      scale="1 1 1"
    >
    </a-text>
    <a-text
      id="bet4"
      value="0$"
      align="center"
      color="#A3E447"
      position="-2.8 -0.25 -32.5"
      scale="1 1 1"
    >
    </a-text>
  </a-entity>

  <a-entity id="validButton" position="5.60 1.4 -3.8">
    <a-text
      value="Confirm"
      align="center"
      color="#FFF"
      position="-4.5 -0.20 -32.4"
      scale="0.8 0.8 0.8  "
      rotation="340 0 0"
    >
    </a-text>
    <a-box
      position="-4.5 -0.25 -32.5"
      class="interactable"
      depth="0.1"
      height="0.3"
      width="1"
      color="#3246E7"
      rotation="340 0 0"
    >
    </a-box>
  </a-entity>

  <a-box
    id="trap1"
    pivot="0 0 -0.65"
    position="-1.636 0.937 -37.735"
    depth="0.5"
    height="0.0001"
    width="0.5"
    color="#BABABA"
    scale="2.6 1.0 2.6"
  >
  </a-box>
  <a-box
    id="trap2"
    position="0.175 0.937 -37.735"
    pivot="0 0 -0.65"
    depth="0.5"
    height="0.0001"
    width="0.5"
    color="#BABABA"
    scale="2.6 1.0 2.6"
  >
  </a-box>
  <a-box
    id="trap3"
    position="2.025 0.937 -37.735"
    pivot="0 0 -0.65"
    depth="0.5"
    height="0.0001"
    width="0.5"
    color="#BABABA"
    scale="2.6 1.0 2.6"
  >
  </a-box>
  <a-box
    id="trap4"
    position="3.837 0.937 -37.735"
    pivot="0 0 -0.65"
    depth="0.5"
    height="0.0001"
    width="0.5"
    color="#BABABA"
    scale="2.6 1.0 2.6"
  >
  </a-box>
</a-entity>
