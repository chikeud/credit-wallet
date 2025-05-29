import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';

type KycResponse = {
    fullName: string;
    bvn: {
        bvn: string;
        birthdate: string;
    };
    dob: string;
    verified: {
        state: string,
        status: string
    }
};

export default function Dashboard() {
    const [form, setForm] = useState({
        bvn: '',
        firstname: '',
        lastname: '',
    });
    const [kyc, setKyc] = useState<KycResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setKyc(null);

        try {
            const res = await fetch('http://localhost:3000/api/kyc/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer-1509',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Request failed');

            const data = await res.json();
            setKyc(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch KYC data');
        } finally {
            setLoading(false);
        }
    console.log(form)};

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Client KYC Dashboard
            </Typography>

            <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mb: 4 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="BVN"
                        name="bvn"
                        value={form.bvn}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify KYC'}
                        </Button>
                    </Box>
                </form>
            </Paper>

            {error && <Typography color="error">{error}</Typography>}

            {kyc && (
                <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
                    <Typography variant="h6">KYC Result</Typography>
                    <Typography><strong>Full Name:</strong> {kyc.fullName}</Typography>
                    <Typography><strong>BVN:</strong> {kyc.bvn.bvn}</Typography>
                    <Typography><strong>Date of Birth:</strong> {kyc.dob}</Typography>
                    <Typography><strong>State:</strong> {kyc.verified.state}</Typography>
                    <Typography><strong>Status:</strong> {kyc.verified.status}</Typography>
                </Paper>
            )}
        </Box>
    );
}
