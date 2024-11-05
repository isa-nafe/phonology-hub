document.addEventListener('DOMContentLoaded', () => {
    const featureListElement = document.getElementById('feature-list');
    const findClassButton = document.getElementById('find-class');
    const resultElement = document.getElementById('result');
    const classSoundsElement = document.getElementById('class-sounds');
    const searchTypeSelect = document.getElementById('search-type');

    let distinctiveFeatures = [];
    let ipaData = {};

    fetch('/api/distinctive_features')
        .then(response => response.json())
        .then(data => {
            distinctiveFeatures = data;
            renderFeatureList();
        })
        .catch(error => console.error('Error fetching distinctive features data:', error));

    fetch('/api/ipa_chart')
        .then(response => response.json())
        .then(data => {
            ipaData = data;
            console.log('IPA Data:', ipaData);
        })
        .catch(error => console.error('Error fetching IPA chart data:', error));

    function renderFeatureList() {
        distinctiveFeatures.forEach(feature => {
            const checkboxElement = document.createElement('div');
            checkboxElement.className = 'feature-checkbox';
            checkboxElement.innerHTML = `
                <input type="checkbox" id="${feature}" name="${feature}">
                <label for="${feature}">${feature}</label>
            `;
            featureListElement.appendChild(checkboxElement);
        });
    }

    findClassButton.addEventListener('click', findNaturalClass);

    function findNaturalClass() {
        const selectedFeatures = Array.from(document.querySelectorAll('#feature-list input:checked'))
            .map(checkbox => checkbox.name);

        const searchType = searchTypeSelect.value;

        console.log('Selected Features:', selectedFeatures);
        console.log('Search Type:', searchType);

        if (selectedFeatures.length === 0) {
            resultElement.textContent = 'Please select at least one feature.';
            classSoundsElement.textContent = '';
            return;
        }

        let naturalClass;
        if (searchType === 'all') {
            naturalClass = findSoundsWithAllFeatures(selectedFeatures);
        } else if (searchType === 'any') {
            naturalClass = findSoundsWithAnyFeature(selectedFeatures);
        } else {
            naturalClass = findSoundsWithoutFeatures(selectedFeatures);
        }

        console.log('Natural Class:', naturalClass);

        if (naturalClass.length > 0) {
            resultElement.textContent = `Natural class: Sounds ${searchType === 'without' ? 'without' : 'with'} features [${selectedFeatures.join(', ')}]`;
            classSoundsElement.textContent = `Sounds in this class: ${naturalClass.join(', ')}`;
        } else {
            resultElement.textContent = 'No sounds match the selected criteria.';
            classSoundsElement.textContent = '';
        }
    }

    function findSoundsWithAllFeatures(features) {
        console.log('Finding sounds with all features:', features);
        const allSounds = getAllSounds();
        
        return allSounds.filter(sound => {
            return features.every(feature => sound.features.includes(feature));
        }).map(sound => sound.symbol);
    }

    function findSoundsWithAnyFeature(features) {
        console.log('Finding sounds with any feature:', features);
        const allSounds = getAllSounds();
        
        return allSounds.filter(sound => {
            return features.some(feature => sound.features.includes(feature));
        }).map(sound => sound.symbol);
    }

    function findSoundsWithoutFeatures(features) {
        console.log('Finding sounds without features:', features);
        const allSounds = getAllSounds();
        
        return allSounds.filter(sound => {
            return features.every(feature => !sound.features.includes(feature));
        }).map(sound => sound.symbol);
    }

    function assignFeatures(sound) {
        const features = [];
        if (sound.symbol) {
            console.log('Assigning features for sound:', sound.symbol);
            
            if (!'aeiouæɑɒəɛɔʊʌyøɨʉɯuɪʏeøɘɤoəɜʌɔæɐaɶɑɒ'.includes(sound.symbol)) {
                features.push('consonantal');
            }
            
            if ('mnŋɲɳlrjwaeiouæɑɒəɛɔʊʌyøɨʉɯuɪʏeøɘɤoəɜʌɔæɐaɶɑɒ'.includes(sound.symbol)) {
                features.push('sonorant');
            }
            
            if ('aeiouæɑɒəɛɔʊʌyøɨʉɯuɪʏeøɘɤoəɜʌɔæɐaɶɑɒ'.includes(sound.symbol)) {
                features.push('syllabic');
            }
            
            if ('bdgvzʒʐʝɣʁʕɦmnŋɲɳlrjwaeiouæɑɒəɛɔʊʌyøɨʉɯuɪʏeøɘɤoəɜʌɔæɐaɶɑɒ'.includes(sound.symbol)) {
                features.push('voice');
            }
            
            if ('ptbdmnfvθðszɬɮ'.includes(sound.symbol)) {
                features.push('anterior');
            }
            
            if ('tdsznlrθð'.includes(sound.symbol)) {
                features.push('coronal');
            }
            
            if ('fvθðszʃʒɕʑxɣχʁhɦ'.includes(sound.symbol) || 'aeiouæɑɒəɛɔʊʌyøɨʉɯuɪʏeøɘɤoəɜʌɔæɐaɶɑɒ'.includes(sound.symbol)) {
                features.push('continuant');
            }
            
            if ('mnŋɲɳ'.includes(sound.symbol)) {
                features.push('nasal');
            }
            
            if ('szʃʒ'.includes(sound.symbol)) {
                features.push('strident');
            }
            
            if ('lɬɮ'.includes(sound.symbol)) {
                features.push('lateral');
            }
            
            if ('tʃdʒ'.includes(sound.symbol)) {
                features.push('delayed release');
            }
            
            if ('pʰtʰkʰ'.includes(sound.symbol)) {
                features.push('spread glottis');
            }
            
            if ('pʼtʼkʼ'.includes(sound.symbol)) {
                features.push('constricted glottis');
            }
            
            if ('pbmfvʍw'.includes(sound.symbol)) {
                features.push('labial');
            }
            
            if ('aeiouæɑɒəɛɔʊʌyøɨʉɯuɪʏeøɘɤoəɜʌɔæɐaɶɑɒ'.includes(sound.symbol)) {
                if ('uoɔøyʊʏœɶɒʉ'.includes(sound.symbol) || sound.rounded) {
                    features.push('round');
                }
                
                if ('iuɪʊyʏɨʉɯ'.includes(sound.symbol)) {
                    features.push('high');
                }
                
                if ('eøɘɵɤoəɜʌɔ'.includes(sound.symbol)) {
                    features.push('mid');
                }
                
                if ('aæɑɒɐɶ'.includes(sound.symbol)) {
                    features.push('low');
                }
                
                if ('ieɛæyøœɪʏʉɨ'.includes(sound.symbol)) {
                    features.push('front');
                }
                
                if ('ɨʉəɜɐ'.includes(sound.symbol)) {
                    features.push('central');
                }
                
                if ('uoɔɑɒʊʌɤɯ'.includes(sound.symbol)) {
                    features.push('back');
                }
                
                if ('iueoaɑɔæøy'.includes(sound.symbol)) {
                    features.push('tense');
                } else {
                    features.push('lax');
                }
            }
            
            console.log('Assigned features:', features);
        }
        return features;
    }

    function getAllSounds() {
        const allSounds = [];

        if (ipaData.consonants && ipaData.consonants.pulmonic && ipaData.consonants.pulmonic.rows) {
            ipaData.consonants.pulmonic.rows.forEach(row => {
                row.forEach(cell => {
                    if (Array.isArray(cell)) {
                        cell.forEach(sound => {
                            if (typeof sound === 'string') {
                                allSounds.push({ symbol: sound, features: assignFeatures({symbol: sound}) });
                            } else {
                                allSounds.push({ ...sound, features: assignFeatures(sound) });
                            }
                        });
                    } else if (cell && typeof cell === 'object') {
                        allSounds.push({ ...cell, features: assignFeatures(cell) });
                    } else if (typeof cell === 'string') {
                        allSounds.push({ symbol: cell, features: assignFeatures({symbol: cell}) });
                    }
                });
            });
        }

        if (ipaData.vowels && ipaData.vowels.rows) {
            ipaData.vowels.rows.forEach(row => {
                row.forEach(cell => {
                    if (Array.isArray(cell)) {
                        cell.forEach(sound => {
                            if (typeof sound === 'string') {
                                allSounds.push({ symbol: sound, features: assignFeatures({symbol: sound}) });
                            } else {
                                allSounds.push({ ...sound, features: assignFeatures(sound) });
                            }
                        });
                    } else if (cell && typeof cell === 'object') {
                        allSounds.push({ ...cell, features: assignFeatures(cell) });
                    } else if (typeof cell === 'string') {
                        allSounds.push({ symbol: cell, features: assignFeatures({symbol: cell}) });
                    }
                });
            });
        }

        if (ipaData.non_pulmonic_consonants) {
            Object.values(ipaData.non_pulmonic_consonants).forEach(category => {
                category.forEach(sound => {
                    if (typeof sound === 'string') {
                        allSounds.push({ symbol: sound, features: assignFeatures({symbol: sound}) });
                    } else {
                        allSounds.push({ ...sound, features: assignFeatures(sound) });
                    }
                });
            });
        }

        if (ipaData.other_symbols) {
            ipaData.other_symbols.forEach(sound => {
                if (typeof sound === 'string') {
                    allSounds.push({ symbol: sound, features: assignFeatures({symbol: sound}) });
                } else {
                    allSounds.push({ ...sound, features: assignFeatures(sound) });
                }
            });
        }

        console.log('All Sounds:', allSounds);
        return allSounds;
    }
});
