<a-entity
      animation__position="property: position; to: 1 2 -36; dur: 500; easing: linear;"
      animation__scale="property: scale; to: 1.03 1.02 1.03; dur: 1500; easing: easeInOutQuad; loop: true; dir: alternate;"
      id="menuZone"
      position="1 0 -36"
    >
    <a-entity id="menu-screen" position="0 2 -3">
      <a-text
        align="center"
        value="Let Him Quizz!"
        color="#FFF"
        scale="1.5 1.5 1.5"
        position="0 0 0.1"
      ></a-text>
      <a-text
        align="center"
        value="In this TV show, you will play 4 minigames that will develop your english culture and your vocabulary. \n The goal ? Winning as much money as you can ! \n \n So if you are ready..."
        color="#FFF"
        position="0 -1 0.1"
      ></a-text>
    </a-entity>
    <a-entity position="-0.2 1.5 -1.5" rotation="-30 0 0">
    <a-text
    position="-0.5 -1.5 0.1"

        value="English Mode"
        align="center"
        color="#FFF"
        scale="0.8 0.8 0.8"
        rotation="0 0 0"
    >
    </a-text>
    <a-box
        position="-0.5 -1.5 0"
        class="interactable startButton-menu"
        data-category="english"
        depth="0.1"
        height="0.3"
        width="1.1"
        color="#9E35C1"
        rotation="0 0 0"
    >
    </a-box>
    </a-entity>

    <a-entity position="1.2 1.5 -1.5" rotation="-30 0 0">
    <a-text
    position="-0.5 -1.5 0.1"

        value="Trivia Mode"
        align="center"
        color="#FFF"
        scale="0.8 0.8 0.8"
        rotation="0 0 0"
    >
    </a-text>
    <a-box
        position="-0.5 -1.5 0"
        class="interactable startButton-menu"
        data-category="trivia"
        depth="0.1"
        height="0.3"
        width="1.1"
        color="#9E35C1"
        rotation="0 0 0"
    >
    </a-box>
    </a-entity>
</a-entity>