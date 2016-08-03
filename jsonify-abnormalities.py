#!/usr/bin/python3

import json
import re

f = open('hp.obo')
all_terms = {}
for line in f:
    if line.startswith('id:'):
        code = line[len('id: '):len(line)-1]
        all_terms[code] = {}
    elif line.startswith('name:'):
        all_terms[code]['name'] = line[len('name: '):len(line)-1]
    elif line.startswith('def:'):
        all_terms[code]['def'] = re.compile('def: "(.+)"').match(line).group(1)
    elif line.startswith('synonym:'):
        if not 'synonyms' in all_terms[code]:
            all_terms[code]['synonyms'] = []
        all_terms[code]['synonyms'].append(re.compile('synonym: "(.+)"').match(line).group(1))
    elif line.startswith('is_a:'):
        if not 'parents' in all_terms[code]:
            all_terms[code]['parents'] = []
        all_terms[code]['parents'].append(re.compile('is_a: (HP:[0-9]+)').match(line).group(1))
f.close()

def is_abnormality(code):
    if code == 'HP:0000118':
        return True
    if not 'parents' in all_terms[code]:
        return False
    for parent in all_terms[code]['parents']:
        if is_abnormality(parent):
            return True
    return False

abnormality_terms = {}
for term in all_terms:
    if is_abnormality(term):
        abnormality_terms[term] = all_terms[term]

f = open('abnormalities.js', 'w')
f.write('module.exports = ')
json.dump(abnormality_terms, f, sort_keys=True, indent=4)
f.close()
