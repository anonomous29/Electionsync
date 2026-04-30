import unittest
import json
from app import app

class IDCheckerTestCase(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_single_voter_id_valid(self):
        response = self.client.post('/api/validate-id', json={'documents': ['voter_id']})
        data = json.loads(response.data)
        self.assertTrue(data['valid'])

    def test_aadhaar_utility_bill_valid(self):
        response = self.client.post('/api/validate-id', json={'documents': ['aadhaar', 'utility_bill']})
        data = json.loads(response.data)
        self.assertTrue(data['valid'])

    def test_aadhaar_only_invalid(self):
        response = self.client.post('/api/validate-id', json={'documents': ['aadhaar']})
        data = json.loads(response.data)
        self.assertFalse(data['valid'])

    def test_passport_valid(self):
        response = self.client.post('/api/validate-id', json={'documents': ['passport']})
        data = json.loads(response.data)
        self.assertTrue(data['valid'])

    def test_pan_bank_passbook_valid(self):
        response = self.client.post('/api/validate-id', json={'documents': ['pan_card', 'bank_passbook']})
        data = json.loads(response.data)
        self.assertTrue(data['valid'])

    def test_empty_documents_invalid(self):
        response = self.client.post('/api/validate-id', json={'documents': []})
        data = json.loads(response.data)
        self.assertFalse(data['valid'])

if __name__ == '__main__':
    unittest.main()
