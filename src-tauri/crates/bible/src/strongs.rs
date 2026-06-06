use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

use serde::{Deserialize, Serialize};

use crate::error::BibleError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StrongsEntry {
    pub number: String,
    pub lemma: String,
    pub xlit: String,
    pub pronounce: String,
    pub description: String,
}

#[derive(Debug, Clone, Default)]
pub struct StrongsDictionary {
    pub entries: HashMap<String, StrongsEntry>,
}

impl StrongsDictionary {
    /// Load the Strong's dictionary from a JSON file.
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self, BibleError> {
        let file = File::open(path).map_err(|e| BibleError::Internal(e.to_string()))?;
        let reader = BufReader::new(file);
        
        let vec: Vec<StrongsEntry> = serde_json::from_reader(reader)
            .map_err(|e| BibleError::Internal(format!("Failed to parse Strong's JSON: {}", e)))?;
            
        let mut entries = HashMap::with_capacity(vec.len());
        for entry in vec {
            entries.insert(entry.number.clone(), entry);
        }
        
        Ok(Self { entries })
    }

    /// Retrieve a specific Strong's entry by number (e.g., "H1234" or "G1234")
    pub fn get(&self, number: &str) -> Option<&StrongsEntry> {
        self.entries.get(number)
    }
}
