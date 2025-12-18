<a-entity
      animation__position="property: position; to: 1 2 -36; dur: 500; easing: linear;"
      animation__scale="property: scale; to: 1.03 1.02 1.03; dur: 1500; easing: easeInOutQuad; loop: true; dir: alternate;"
      id="endingZone"
      position="1 0 -36"
    >
    <a-entity id="ending-screen" position="0 2 -3">
      <a-text
        align="center"
        value="Game over !"
        color="#FFF"
        scale="1.5 1.5 1.5"
        position="0 0 0.1"
      ></a-text>
      <a-text
        align="center"
        value="You won ${{final-score}} !"
        color="#FFF"
        scale="1.5 1.5 1.5"
        position="0 -1 0.1"
      ></a-text>
      <a-text
        align="center"
        value="Enter your name :"
        color="#FFF"
        position="0 -1.6 0.1"
        scale="1 1 1"
        rotation="0 0 0"
    >
    </a-text>
    </a-entity>
</a-entity>