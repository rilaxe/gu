import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  async getBase64ImageFromUrl(id: string): Promise<string | ArrayBuffer | null> {
    try {
        const params = new HttpParams().set('id', id);  // Set the Id parameter
        const imageUrl =  `${environment.apiUrl}/school/getSchoolLogo`;
      const base64Image = await this.http.get(imageUrl, { responseType: 'text', params })
        .pipe(
          retry(3),  // Retry up to 3 times on error
          catchError((error) => {
            console.error('Error fetching image:', error);
            return throwError(() => new Error('Failed to fetch image after retries'));
          })
        ).toPromise();

      const contentType = 'image/png'; // Adjust according to your image type
      const blob = this.base64ToBlob(base64Image, contentType);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = () => reject('Failed to convert image to Base64');
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to fetch image after retries: ${error}`);
    }
  }

  private base64ToBlob(base64: string, contentType: string = ''): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
