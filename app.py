import os
import json
import traceback
from flask import Flask, render_template, jsonify, send_from_directory, request
import nltk
from nltk import word_tokenize, pos_tag, RegexpParser
from nltk.tree import Tree
from nltk.chunk import ne_chunk

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

app = Flask(__name__, static_folder='static', static_url_path='/static', template_folder='templates')

# Load IPA chart data
with open('static/data/ipa_chart.json', 'r') as f:
    ipa_chart_data = json.load(f)

# Load distinctive features data
with open('static/data/distinctive_features.json', 'r') as f:
    distinctive_features_data = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/ipa_chart')
def get_ipa_chart():
    return jsonify(ipa_chart_data)

@app.route('/api/distinctive_features')
def get_distinctive_features():
    return jsonify(distinctive_features_data)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/analyze_sentence', methods=['POST'])
def analyze_sentence():
    sentence = request.form.get('sentence')
    if not sentence:
        app.logger.error("No sentence provided in the request")
        return jsonify({"error": "No sentence provided"}), 400

    try:
        app.logger.info(f"Analyzing sentence: {sentence}")

        # Tokenization
        tokens = word_tokenize(sentence)
        app.logger.debug(f"Tokens: {tokens}")
        
        # Part-of-speech tagging
        pos_tags = pos_tag(tokens)
        app.logger.debug(f"POS tags: {pos_tags}")
        
        # Syntax tree generation
        parse_tree = ne_chunk(pos_tags)
        tree_string = ' '.join(str(parse_tree).split())
        app.logger.debug(f"Syntax tree: {tree_string}")
        
        # Phrase identification
        grammar = r"""
            NP: {<DT|JJ|NN.*>+}          # Chunk sequences of DT, JJ, NN
            PP: {<IN><NP>}               # Chunk prepositions followed by NP
            VP: {<VB.*><NP|PP|CLAUSE>+$} # Chunk verbs and their arguments
            CLAUSE: {<NP><VP>}           # Chunk NP, VP
        """
        cp = RegexpParser(grammar)
        result = cp.parse(pos_tags)
        
        phrases = []
        for subtree in result.subtrees():
            if subtree.label() in ['NP', 'VP', 'PP']:
                phrases.append(f"{subtree.label()}: {' '.join([word for word, tag in subtree.leaves()])}")
        app.logger.debug(f"Identified phrases: {phrases}")
        
        # Tense analysis (simplified)
        tense = "Unknown"
        for word, tag in pos_tags:
            if tag.startswith('VB'):
                if tag == 'VBD':
                    tense = "Past"
                elif tag == 'VBP' or tag == 'VBZ':
                    tense = "Present"
                elif tag == 'VBG':
                    tense = "Present Continuous"
                elif tag == 'VBN':
                    tense = "Past Participle"
                break
        app.logger.debug(f"Identified tense: {tense}")

        analysis_result = {
            "tokens": tokens,
            "pos_tags": pos_tags,
            "syntax_tree": tree_string,
            "phrases": phrases,
            "tense": tense
        }
        
        app.logger.info("Sentence analysis completed successfully")
        return jsonify(analysis_result)
    except nltk.tokenize.TokenizerException as e:
        error_message = f"Tokenization error: {str(e)}"
        app.logger.error(f"Tokenization error: {traceback.format_exc()}")
        return jsonify({"error": error_message}), 400
    except nltk.tagger.TaggerError as e:
        error_message = f"Part-of-speech tagging error: {str(e)}"
        app.logger.error(f"Part-of-speech tagging error: {traceback.format_exc()}")
        return jsonify({"error": error_message}), 400
    except nltk.chunk.ChunkParserError as e:
        error_message = f"Syntax tree generation error: {str(e)}"
        app.logger.error(f"Syntax tree generation error: {traceback.format_exc()}")
        return jsonify({"error": error_message}), 400
    except Exception as e:
        error_message = f"Unexpected error in sentence analysis: {str(e)}"
        app.logger.error(f"Unexpected error in sentence analysis: {traceback.format_exc()}")
        return jsonify({"error": error_message}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
