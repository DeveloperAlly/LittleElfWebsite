

module.exports = {

  function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    if (x == "") {
        alert("Name must be filled out");
        return false;
    }
  },


}; ///end exports

/*
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script   src="https://code.jquery.com/jquery-2.2.4.min.js"   integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="   crossorigin="anonymous"></script>

<script>
$('.match.example form')
.form({
  on: 'blur',
  fields: {
    match: {
      identifier  : 'match2',
      rules: [
        {
          type   : 'match[match1]',
          prompt : 'Please put the same value in both fields'
        }
      ]
    },
  }
})
;
</script>
*/
