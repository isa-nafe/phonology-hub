# IPA Chart Explorer

A comprehensive web application for linguistics students to explore and understand the International Phonetic Alphabet (IPA) through interactive features and tools.

## Description

IPA Chart Explorer is an interactive educational tool designed to help linguistics students and enthusiasts explore the International Phonetic Alphabet. The application provides an intuitive interface for studying IPA symbols, discovering natural classes based on distinctive features, and analyzing sentences using linguistic tools.

## Features

### Interactive IPA Chart
- Clickable IPA symbols with detailed information
- Visual organization matching standard IPA chart layout
- Popup displays with symbol descriptions and usage examples
- Separate sections for consonants, vowels, and non-pulmonic consonants

### Natural Class Finder
- Selection of multiple distinctive features
- Three search types:
  - All selected features
  - Any selected feature
  - Without selected features
- Real-time results showing matching IPA symbols
- Clear visualization of natural classes

### Sentence Analysis Tool
- Comprehensive linguistic analysis of input sentences
- Part-of-speech tagging
- Syntax tree generation
- Phrase identification
- Tense analysis
- Detailed breakdown of sentence components

### Symbol Information
- Detailed explanations for each IPA symbol
- Practical usage examples
- Pronunciation guidance
- Feature classifications

## Technologies Used

- **Flask**: Backend web framework
- **NLTK**: Natural Language Processing toolkit for sentence analysis
- **Vanilla JavaScript**: Frontend interactivity without frameworks
- **HTML/CSS**: Structure and styling
  - Responsive design for various screen sizes
  - Custom styling for IPA symbols and popups

## Installation & Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install required Python packages:
```bash
pip install flask nltk
```

3. Download required NLTK data:
```python
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')
```

4. Run the application:
```bash
python main.py
```

The application will be available at `http://localhost:5000`

## Usage Examples

### Interactive IPA Chart
1. Navigate to the main page
2. Click on any IPA symbol to see its details
3. Example: Click on [p] to see:
   - Description: "Voiceless bilabial plosive"
   - Example: "spin"
   - Explanation: "Produced by completely stopping airflow at the lips and then releasing it."

### Natural Class Finder
1. Select distinctive features from the checkboxes
2. Choose search type (All/Any/Without)
3. Example: 
   - Select "voiced" and "labial"
   - Choose "All selected features"
   - Find natural class including [b], [v], [m]

### Sentence Analysis
1. Enter a sentence in the analysis tool
2. Example: "The cat sits on the mat"
   - Tokens: [The, cat, sits, on, the, mat]
   - POS Tags: DET, NOUN, VERB, PREP, DET, NOUN
   - Phrases: NP (The cat), VP (sits), PP (on the mat)
   - Tense: Present

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
