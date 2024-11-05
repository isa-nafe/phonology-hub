document.addEventListener('DOMContentLoaded', () => {
    const sentenceForm = document.getElementById('sentence-form');
    const analysisResult = document.getElementById('analysis-result');

    sentenceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const sentence = document.getElementById('sentence-input').value;

        try {
            const response = await fetch('/analyze_sentence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `sentence=${encodeURIComponent(sentence)}`,
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }

            const result = await response.json();

            if (response.ok) {
                if (result.error) {
                    console.error('Error analyzing sentence:', result.error);
                    analysisResult.innerHTML = `<p class="error">Error analyzing sentence: ${result.error}</p>`;
                } else {
                    console.log('Sentence analysis result:', result);
                    displayAnalysisResult(result);
                }
            } else {
                console.error('Server error:', result.error);
                analysisResult.innerHTML = `<p class="error">Server error: ${result.error}</p>`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            analysisResult.innerHTML = `<p class="error">An error occurred while communicating with the server: ${error.message}</p>`;
        }
    });

    function displayAnalysisResult(result) {
        let html = '<h3>Sentence Analysis</h3>';
        
        html += '<h4>Tokens:</h4>';
        html += `<p>${result.tokens.join(', ')}</p>`;
        
        html += '<h4>Part-of-speech Tags:</h4>';
        html += '<ul>';
        result.pos_tags.forEach(([word, tag]) => {
            html += `<li>${word}: ${tag}</li>`;
        });
        html += '</ul>';
        
        html += '<h4>Syntax Tree:</h4>';
        html += `<pre>${result.syntax_tree}</pre>`;
        
        html += '<h4>Phrases:</h4>';
        html += '<ul>';
        result.phrases.forEach(phrase => {
            html += `<li>${phrase}</li>`;
        });
        html += '</ul>';
        
        html += '<h4>Tense:</h4>';
        html += `<p>${result.tense}</p>`;
        
        analysisResult.innerHTML = html;
    }
});
