function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
      couchdbConf: {
        db_uri: document.querySelector("#db_uri").value,
        db_live_replication: document.querySelector("#db_live_replication").value
      }
    });
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#db_uri").value = result.db_ur || "";
      document.querySelector("#db_live_replication").value = result.db_live_replication || false
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    let dbUri = browser.storage.sync.get("db_uri");
    dbUri.then(setCurrentChoice, onError);

    let dbLiveReplication = browser.storage.sync.get("db_live_replication");
    dbLiveReplication.then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  