var apiKey = 'AIzaSyDvbDBbA_MaAoZIXkkczQ0eZhRXyt3dIz0';
/**
 * Initialize the API client and make a request.
 */
function load() {
  $(document).ready(function(){
    gapi.client.setApiKey(apiKey);
    electionQuery(renderElections);
    /**
     * Build and execute request to look up voter info for provided address.
     * @param {string} address Address for which to fetch voter info.
     * @param {function(Object)} callback Function which takes the
     *     response object as a parameter.
     */
     function lookup(address, electionId, callback) {
      /**
       * Request object for given parameters.
       * @type {gapi.client.HttpRequest}
       */
      var req = gapi.client.request({
          'path' : '/civicinfo/v2/voterinfo',
          'params' : {'electionId' : electionId, 'address' : address}
      });
     req.execute(callback);
    }

    /**
     * Render results in the DOM.
     * @param {Object} response Response object returned by the API.
     * @param {Object} rawResponse Raw response from the API.
     */
    function renderResults(response, rawResponse) {
      var res = $("#results");
      res.html("");
      console.log(res.html());
      res.append('<tr id="contests"><th>Office</th></tr>');
      for (var i = 0; i < response.contests.length; i++){
        console.log(response.contests[i].office);
        res.append('<tr><td>'+ response.contests[i].office + '</td></tr>');
      }
    }

    function renderElections(response, rawResponse) {
      var el = document.getElementById('failed-results');
      var electionsArr = [];
      if (!response || response.error) {
        el.appendChild(document.createTextNode(
            'Error while trying to fetch polling place'));
        return;
      }

      if (response.elections.length > 0) {
        for(var i = 0; i < response.elections.length; i++){
          var id = response.elections[i].id;
          var name = response.elections[i].name;
          var electionDay = response.elections[i].electionDay;
          var electionObj = {electionID: id, electionName: name, electionDate: electionDay};
          electionsArr[i] = electionObj;
        }

        var $table = $('#results');
        var tr = '<tr>'
        for(var i = 0; i < electionsArr.length; i++){
          var id = electionsArr[i].electionID;
          console.log(id);
          var name = electionsArr[i].electionName;
          var date = electionsArr[i].electionDate;
          $table.append('<tr style="cursor: pointer;" class="election-data" data-id="'+id+'"><td>'+ name +'</td><td>'+ date +'</td></tr>');
        }
      } else {
        el.appendChild(document.createTextNode('Could not find elections'));
      }
    }

    function electionQuery(callback){
      var req = gapi.client.request({
          'path' : 'civicinfo/v2/elections',
          'params' : {'key' : apiKey}
      });
     req.execute(callback);
    }

    $('body').on('click', '#results .election-data', function() {
      var id = $(this).data('id');
      $('#elID').val(id);
      $('#addressModal').openModal();
    });

    $('body').on('click', '#submitAddress', function() {
      var address = $('#address').val();
      var id = $('#elID').val();
      console.log(address, id);
      if(address != null && id != null){
        lookup(address, id, renderResults);
      }
      $('#addressModal').closeModal();
    });
  });
}
