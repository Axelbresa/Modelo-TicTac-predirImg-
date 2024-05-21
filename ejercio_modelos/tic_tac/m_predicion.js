tf.ready().then(() => {
    const modelPath = './ttt_model.json'
    tf.tidy(() => {
      tf.loadLayersModel(modelPath).then((model) => {
        const g = tf.tensor([1, 0, 0, 0, 0, 0, 0, 0 ,0])

        const matches = tf.stack([g])
        const result = model.predict(matches)
        // Log the results
        result.reshape([9]).print()
      })
    })
  })