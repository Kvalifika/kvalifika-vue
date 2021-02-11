# Kvalifika Vue SDK

This is library to use kvalifika sdk easily in Vue js

## Installation

    npm install kvalifika-vue

## Usage

### Basic usage

```js
<template>
  <div id="app">
    <KvalifikaVue
      appId="your_app_id"
      @complete="handleComplete"
    />
  </div>
</template>

<script>
import KvalifikaVue from 'kvalifika-vue';

export default {
  name: 'app',
  components: {
    KvalifikaVue
  },
  methods: {
    // Fires when all processes ends
    handleComplete(event) {
      // get information about verification (event.data)
    }
  }
}
</script>


```

### Props

```js
props: {
  appId: String,
  onComplete: Function
}
```


## Build

    npm run build
