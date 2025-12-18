<a-entity  position=" -6 2 -39">
      <a-entity id="moneyStack"
        gltf-model="./src/assets/modele3d/money.glb"
        position="{{x}} 8 {{z}}"
        scale="0.5 0.5 0.5"
        rotation="0 0 0"
        dynamic-body="mass: 5; shape: none;"
        shape="shape: box; halfExtents: 0.5 0.15 0.5;"
      ></a-entity>
</a-entity>