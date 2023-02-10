import axios from 'axios';
import { Vulnerability } from '@database';

export default class ScanService {
  /**
   * generate vulnerabilities
   * @returns the list of vulnerabilities.
   */
  async getVulnerabilities(): Promise<Vulnerability[]> {
    const totalVulnerability = ~~(Math.random() * 6);
    if (totalVulnerability === 0) return [];

    const randomStrings = (
      await axios.get<string[]>(
        `https://names.drycodes.com/${totalVulnerability}?nameOptions=funnyWords`
      )
    ).data;

    return randomStrings.map(
      (str) =>
        ({
          path: str,
          beginLine: 1 + ~~(Math.random() * 100),
        } as Vulnerability)
    );
  }
}
