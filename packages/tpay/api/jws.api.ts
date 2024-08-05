import https from "https"
import 'dotenv/config';
const superagent = require('superagent');
const pki = require('node-forge').pki;
import * as crypto from 'crypto';


class JwsData {
    headers: string;
    signature: string;
    
    constructor(signature: string){
        [this.headers, this.signature] = signature.split("..")
    }
}

export async function validateJwsSignature(request: any): Promise<boolean> {
    // Get Request X-JWS-Signature header
    const jws = request.headers['x-jws-signature'];
  
    if (!jws) {
        throw new Error('Missing JWS header');
    }
  
    // Extract JWS header properties
    const jwsData = new JwsData(jws);
    //console.log(jwsData)
    // Decode received headers json string from base64_url_safe
    //console.log(strtr(jwsData.headers, '-_', '+/'))

    const headersJson = base64decode(strtr(jwsData.headers, '-_', '+/'));
    //console.log(headersJson)
    
    // Get x5u header from headers json
    const headersData: { x5u?: string } = JSON.parse(headersJson);
    //console.log(headersData)
    
    if (!headersData.x5u) {
        throw new Error('Missing x5u header');
    }
  
    // Check certificate url
    const prefix = process.env.TPAY_prefix ? process.env.TPAY_prefix : "https://secure.tpay.com";
    if (!headersData.x5u.startsWith(prefix)) {
        throw new Error('Wrong x5u url');
    }

    // Get JWS sign certificate from x5u uri
    // **Note:** This requires implementing certificate retrieval logic (e.g., using fetch API)
    const certificate = await getCertificate(headersData['x5u']); 

    // Verify JWS sign certificate with Tpay CA certificate
    // **Note:** This requires implementing certificate verification logic (e.g., using external library like forge)
    const caCertificate = await getCertificate(prefix + "/x509/tpay-jws-root.pem"); // Assuming cached Tpay CA certificate
  
    if (!verifyCertificate(certificate, caCertificate)) {
        throw new Error('Signing certificate is not signed by Tpay CA certificate');
    }

    // Get request body
    const body = request.body; // Assuming logic to read request body
    console.log(body)
    
    // Encode body to base64_url_safe
    const payload = (strtr(base64encode(body.toString()), '+/', '-_')).replace('=', '');
    //console.log(payload)
  
    // Decode received signature from base64_url_safe
    const decodedSignature = base64decode(strtr(jwsData.signature, '-_', '+/'));
    //console.log(decodedSignature)

    // Verify RFC 7515: JSON Web Signature (JWS)
    // **Note:** This requires implementing JWS signature verification logic (e.g., using external library like forge)
    if (!verifyJwsSignature(body, jwsData.signature, certificate)) {
        throw new Error('Invalid JWS signature');
    }

    // JWS signature verified successfully
    return true;
}

function base64decode(str: string){
    return Buffer.from(str, 'base64').toString('binary').toString();
}

function base64encode(str: string){
    return Buffer.from(str, 'binary').toString('base64');
}

/**
 * Replaces characters or substrings in a string with another string or set of replacements.
 * 
 * @param str The string to perform replacements on.
 * @param replacements A string containing the characters to replace (when using two arguments)
 *                     or an object mapping from characters/substrings to replacements.
 * @param replacement (Optional) The string to replace characters with (when using two arguments).
 * @returns The translated string with replacements applied.
 */
function strtr(str: string, replacements: string | Record<string, string>, replacement?: string): string {
    if (typeof replacements === 'string' && replacement !== undefined) {
        // Handle two-argument case by creating a replacement object
        replacements = replacements.split('').reduce((acc, char, idx) => {
            acc[char] = replacement[idx] || '';
            return acc;
        }, {} as Record<string, string>);
    }

    if (typeof replacements !== 'object' || replacements === null) {
        throw new Error('Invalid replacements argument. Must be a string or object.');
    }

    let result = str;
    for (const [from, to] of Object.entries(replacements)) {
        result = result.split(from).join(to);
    }
    return result;
}

// Helper functions for certificate retrieval and verification (implementation details omitted)
async function getCertificate(url: string) {
    let certificate;
    try {
        const response = await superagent.get(url)
        certificate = response['_body'].toString()
    } catch (error) {
        console.log(error);
    }
    return certificate;
}

function verifyCertificate(certificate: string, caCertificate: string): boolean {
    let status = false;

    try {
        status = pki.verifyCertificateChain(pki.createCaStore([caCertificate]), [pki.certificateFromPem(certificate)]);
    } catch (e) {
        console.log(e)
    }

    return status;
}

function verifyJwsSignature(data: string, signature: string, certificate: string): boolean {
    /*console.log("data: ", data)
    console.log("signature: ", signature)
    console.log("certificate: ", certificate)
    var cert = pki.certificateFromPem(certificate); 
    var pem = pki.publicKeyToPem(cert.publicKey)
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    return verify.verify(pem, signature, 'base64');*/
    return false;
}


