<a-entity id="validButton" position="1.25 1.4 -36">
  <a-text
    value="Confirm"
    align="center"
    color="#FFF"
    position="0 0.05 0.1"
    scale="0.8 0.8 0.8  "
    rotation="340 0 0"
  >
  </a-text>
  <a-box
    position="0 0 0"
    class="interactable"
    depth="0.1"
    height="0.3"
    width="1"
    color="blue"
    rotation="340 0 0"
  >
  </a-box>
</a-entity>

<a-entity position="0.99 3.75 -39">
  <a-text
    id="question"
    align="center"
    value="question"
    color="#FFF"
    position="0 0 0.1"
  ></a-text>
</a-entity>

<a-entity class="answer" position="-0.4 3 -39">
  <a-text
    id="answer1"
    align="center"
    value="answer"
    color="#FFF"
    position="0 0 0.1"
  ></a-text>
  <a-box
    id="boxanswer1"
    position="0 0 0"
    depth="0.1"
    height="0.5"
    width="2.6"
    color="#FF662F"
  ></a-box>
</a-entity>
<a-entity class="answer" position="2.4 3 -39">
  <a-text
    id="answer2"
    value="answer"
    align="center"
    color="#FFF"
    position="0 0 0.1"
  ></a-text>

  <a-box
    id="boxanswer2"
    position="0 0 0"
    depth="0.1"
    height="0.5"
    width="2.6"
    color="#A3E447"
  ></a-box>
</a-entity>
<a-entity class="answer" position="-0.4 2 -39">
  <a-text
    id="answer3"
    align="center"
    value="answer"
    color="#FFF"
    position="0 0 0.1"
  ></a-text>
  <a-box
    id="boxanswer3"
    position="0 0 0"
    depth="0.1"
    height="0.5"
    width="2.6"
    color="#35B1B5"
  ></a-box>
</a-entity>
<a-entity class="answer" position="2.4 2 -39">
  <a-text
    id="answer4"
    align="center"
    value="answer"
    color="#FFF"
    position="0 0 0.1"
  ></a-text>
  <a-box
    id="boxanswer4"
    position="0 0 0"
    depth="0.1"
    height="0.5"
    width="2.6"
    color="#9E35C1"
  ></a-box>
</a-entity>
<a-entity>
  <a-box
    class="interactable"
    id="movableBox1"
    position="2.5 1 -37.5"
    width="0.3"
    height="0.3"
    depth="0.3"
    color="#FF662F"
    dynamic-body="mass: 5"
    data-valeur="1"
  ></a-box>
</a-entity>
<a-entity>
  <a-box
    class="interactable"
    id="movableBox2"
    position="3 1 -37.5"
    width="0.3"
    height="0.3"
    depth="0.3"
    color="#A3E447"
    dynamic-body="mass: 5"
    data-valeur="2"
  ></a-box>
</a-entity>
<a-entity>
  <a-box
    class="interactable"
    id="movableBox3"
    position="3.5 1 -37.5"
    width="0.3"
    height="0.3"
    depth="0.3"
    color="#35B1B5"
    dynamic-body="mass: 5"
    data-valeur="3"
  ></a-box>
</a-entity>
<a-entity>
  <a-box
    class="interactable"
    id="movableBox4"
    position="4 1 -37.5"
    width="0.3"
    height="0.3"
    depth="0.3"
    color="#9E35C1"
    dynamic-body="mass: 5"
    data-valeur="4"
  ></a-box>
</a-entity>

<a-entity id="hollowBox1" position="-0.9 0.1 -37.5" data-valeur="1">
  <a-box
    position="0 0 0"
    width="0.8"
    height="0.1"
    depth="0.8"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0 0.35 0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    static-body
    opacity="0.3"
  ></a-box>
  <a-box
    position="0 0.35 -0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
  <a-box
    position="-0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
</a-entity>
<a-entity id="hollowBox2" position="0 0.1 -37.5" data-valeur="2">
  <a-box
    position="0 0 0"
    width="0.8"
    height="0.1"
    depth="0.8"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0 0.35 0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    static-body
    opacity="0.3"
  ></a-box>
  <a-box
    position="0 0.35 -0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
  <a-box
    position="-0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
</a-entity>
<a-entity id="hollowBox3" position="0.9 0.1 -37.5" data-valeur="3">
  <a-box
    position="0 0 0"
    width="0.8"
    height="0.1"
    depth="0.8"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0 0.35 0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    static-body
    opacity="0.3"
  ></a-box>
  <a-box
    position="0 0.35 -0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
  <a-box
    position="-0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
</a-entity>
<a-entity id="hollowBox4" position="1.8 0.1 -37.5" data-valeur="4">
  <a-box
    position="0 0 0"
    width="0.8"
    height="0.1"
    depth="0.8"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0 0.35 0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    static-body
    opacity="0.3"
  ></a-box>
  <a-box
    position="0 0.35 -0.35"
    width="0.8"
    height="0.8"
    depth="0.1"
    color="#35B1B5"
    opacity="0.3"
    static-body
  ></a-box>
  <a-box
    position="0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
  <a-box
    position="-0.35 0.35 0"
    width="0.1"
    height="0.8"
    depth="0.8"
    opacity="0.3"
    static-body
    color="#35B1B5"
  ></a-box>
</a-entity>

<a-entity position="-0.9 0.1 -37.5">
  <!-- haut -->
  <a-box
    position="2 4 0"
    width="8"
    height="0.1"
    depth="0.8"
    color="#FF0000"
    opacity="0"
    body="type: static; shape: box;"
  ></a-box>
  <!-- devant -->
  <a-box
    position="2 0 0.4"
    width="8"
    height="7.5"
    depth="0.1"
    color="#FF0000"
    opacity="0"
    body="type: static; shape: box;"
  ></a-box>
  <!-- derrier -->
  <a-box
    position="2 0 -0.4"
    width="8"
    height="7.5"
    depth="0.1"
    color="#FF0000"
    opacity="0"
    body="type: static; shape: box;"
  ></a-box>
  <!-- droite -->
  <a-box
    position="6 0.5 0"
    width="0.1"
    height="6.8"
    depth="0.8"
    color="#FF0000"
    opacity="0"
    body="type: static; shape: box;"
  ></a-box>
  <!-- gauche -->
  <a-box
    position="-2 0.5 0"
    width="0.1"
    height="6.8"
    depth="0.8"
    color="#FF0000"
    opacity="0"
    body="type: static; shape: box;"
  ></a-box>
</a-entity>
