
//=======
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
      var el = document.getElementById('results');
      if (!response || response.error) {
        el.appendChild(document.createTextNode(
            'Error while trying to fetch polling place'));
        return;
      }
      var normalizedAddress = response.normalizedInput.line1 + ' ' +
          response.normalizedInput.city + ', ' +
          response.normalizedInput.state + ' ' +
          response.normalizedInput.zip;
      if (response.pollingLocations.length > 0) {
        var pollingLocation = response.pollingLocations[0].address;
        var pollingAddress = pollingLocation.locationName + ', ' +
            pollingLocation.line1 + ' ' +
            pollingLocation.city + ', ' +
            pollingLocation.state + ' ' +
            pollingLocation.zip;
        var normEl = document.createElement('strong');
        normEl.appendChild(document.createTextNode(
            'Polling place for ' + normalizedAddress + ': '));
        el.appendChild(normEl);
        el.appendChild(document.createTextNode(pollingAddress));
      } else {
        el.appendChild(document.createTextNode(
            'Could not find polling place for ' + normalizedAddress));
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
        //var normEl = document.createElement('strong');
        var $table = $('#results');
        var tr = '<tr>'
        for(var i = 0; i < electionsArr.length; i++){
          var id = electionsArr[i].electionID;
          var name = electionsArr[i].electionName;
          var date = electionsArr[i].electionDate;
          $table.append('<tr style="cursor: pointer;" class="election-data" data-id="'+id+'"><td>'+ name +'</td><td>'+ date +'</td></tr>');
          // normEl.appendChild(document.createTextNode(
          //     'Election: '+ electionsArr[i].electionName + ' at ' + electionsArr[i].electionDate));
          // normEl.appendChild(document.createElement('br'));
          // el.appendChild(normEl);
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

    $('#results tr').click(function(){
      var id = this.data('id');
      $('#addressModal').openModal();
    });
    $('#submitAddress').click(function() {
      var address = $(this).prev().val();
      if(address != null && id != null){
        lookup(address, id, renderResults);
      }
      $('#addressModal').closeModal();
    });
  });
  //electionQuery(renderElections);
  //lookup('1263 Pacific Ave. Kansas City KS', electionId,renderResults);
>>>>>>> 4aaf4028f42934bb8d3b2b9fcfc4b4cf1ea6af71
}
