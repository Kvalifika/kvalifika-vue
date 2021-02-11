<template>
  <div id="kvalifika-iframe-container"></div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  props: {
    // Required
    appId: {
      type: String,
      required: true
    },

    // Handlers
    onComplete: Function
  },
  methods: {
    // Performs a session check from your backend with your production SECRET_KEY
    // See index.js file
    async checkSession(sessionId) {
      const data = await axios({
        url: `https://apistaging.kvalifika.com/check-session/${sessionId}`,
        method: 'GET',
        headers: {
          Authorization: this.appId,
        }
      })

      const body = await data.json()
      return JSON.parse(body)
    },

    // livenessStatus: 0/1/2. 0 = passed, 1 = undetermined, 2 = undetermined. 
    // 3D FaceMap came from a session where there was a live human being if and only if the livenessStatus is 0.
    // ..............................................
    // faceMatched is boolean if true face matched document
    // documentValid is boolean if true document is valid
    nextAction({ details: { faceMatched, livenessStatus, documentValid } }) {
      // Handle your results & remove frame, or you can do anything here
      if (faceMatched && !livenessStatus && documentValid) {
        const frame = document.getElementById('kvalifika-iframe-container')
        frame.remove()
        const p = document.createElement("p")
        p.innerHTML = "success"
        document.body.appendChild(p)
      }
    },
    async handleMessage(event) {
      // Checks if full process liveness and document scanning has been finished
      if (event.data.finished) {
        const body = await this.checkSession(event.data.sessionId)
        this.nextAction(body)
      }
      
      // Checks if liveness step has been finished
      if (event.data.isLivenessFinished) {
      // Do something if liveness step has been finished
      }
      
      // Checks is document scanning step has been finsihed
      if (event.data.isDocumentFinished) {
        // this.onComplete?.({data})
    
        // event.data.documentType returns enum type 'ID' or 'PASSPORT'
      }
    },
    async generateVerification() {
        try {
          const { data } = await axios({
            url: 'https://apistaging.kvalifika.com/verification/generate',
            method: 'POST',
            data: { appId: this.appId },
            headers: {
              Originn: 'https://staging.demo.kyc.ge',
            }
          })
      
          const iframe = document.createElement("iframe");
          iframe.setAttribute("id", "kvalifikaIframe");
          // /sessionId ->  /?
          // iframe.setAttribute("src",`http://localhost:3000?sessionId=${sessionId}`);
          iframe.setAttribute("src",  `${data.url}&lang=en`);
          iframe.setAttribute("style", "width: 100vw; height: 100vh");
          iframe.setAttribute("allow", "camera");
          iframe.setAttribute("allowfullscreen", true);
          iframe.setAttribute("scrolling", "yes");
          const container = document.querySelector("#kvalifika-iframe-container");
          container.appendChild(iframe);

      } catch(error) {
        console.error(error)
      }
    }

  },
  mounted() {
    this.generateVerification()
  },
  // CALLED ON COMPONENT CREATION
  created() {
    // Event listener, listens each step is web flow. 
    // If full process has been finished, you can check here 
    // each step if finished liveness or document scanning
    if (typeof window !== "undefined") {
      window.addEventListener('message', this.handleMessage)
    }
  },
  // CALLED ON COMPONENT DESTRUCTION
  destroyed() {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
    }
  }

}
</script>