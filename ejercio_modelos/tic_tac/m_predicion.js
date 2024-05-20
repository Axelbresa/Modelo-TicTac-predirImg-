tf.ready().then(() => {
    const modelPath = './ttt_model.json'
    tf.tidy(() => {
      tf.loadLayersModel(modelPath).then((model) => {
        // pasamos los tensores
        const e = tf.zeros([9])
        // const b = tf.tensor([-1, 0, 0, 1, 1, -1, 0, 0, -1])
        // const g = tf.tensor([1, 0, 1, 0, -1, -1, -1, 0, 1])

        // Stack states into a shape [3, 9]
        const matches = tf.stack([e])
        const result = model.predict(matches)
        console.log(result)
        // Log the results
        result.reshape([3, 3, 3]).print()
      })
    })
  })