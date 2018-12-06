<template>
  
</template>

<script>
export default {
  created(){
    this.$store.dispatch('destroyTokenAndUser')
      .then(response => {
        this.$router.push('/items');
      });
  }
}; 
</script>