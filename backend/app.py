from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def needleman_wunsch(seq1, seq2, match=1, mismatch=-1, gap=-2):
    """Performs Global Sequence Alignment using the Needleman-Wunsch Algorithm."""
    m, n = len(seq1), len(seq2)
    score_matrix = np.zeros((m + 1, n + 1), dtype=int)

    # Initialize first row and column with gap penalties
    for i in range(m + 1):
        score_matrix[i][0] = gap * i
    for j in range(n + 1):
        score_matrix[0][j] = gap * j

    # Fill the matrix using dynamic programming
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            match_score = match if seq1[i - 1] == seq2[j - 1] else mismatch
            score_matrix[i][j] = max(
                score_matrix[i - 1][j - 1] + match_score,  # Diagonal (match/mismatch)
                score_matrix[i - 1][j] + gap,              # Up (gap in seq2)
                score_matrix[i][j - 1] + gap               # Left (gap in seq1)
            )

    # Traceback to get the aligned sequences
    aligned_seq1, aligned_seq2 = "", ""
    i, j = m, n

    while i > 0 or j > 0:
        current_score = score_matrix[i][j]
        if i > 0 and j > 0 and (score_matrix[i - 1][j - 1] + (match if seq1[i - 1] == seq2[j - 1] else mismatch)) == current_score:
            aligned_seq1 = seq1[i - 1] + aligned_seq1
            aligned_seq2 = seq2[j - 1] + aligned_seq2
            i -= 1
            j -= 1
        elif i > 0 and (score_matrix[i - 1][j] + gap) == current_score:
            aligned_seq1 = seq1[i - 1] + aligned_seq1
            aligned_seq2 = "-" + aligned_seq2
            i -= 1
        else:
            aligned_seq1 = "-" + aligned_seq1
            aligned_seq2 = seq2[j - 1] + aligned_seq2
            j -= 1

    return aligned_seq1, aligned_seq2

@app.route('/align', methods=['POST'])
def align_sequences():
    """API Endpoint to align sequences."""
    data = request.json
    seq1 = data.get('seq1')
    seq2 = data.get('seq2')

    if not seq1 or not seq2:
        return jsonify({'error': 'Both sequences must be provided'}), 400

    aligned_seq1, aligned_seq2 = needleman_wunsch(seq1, seq2)
    
    return jsonify({
        'aligned_seq1': aligned_seq1,
        'aligned_seq2': aligned_seq2
    })

if __name__ == '__main__':
    app.run(debug=True)