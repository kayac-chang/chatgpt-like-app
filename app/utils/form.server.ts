export async function decodeForm(formDataOrRequest: FormData | Request) {
  return Object.fromEntries(
    formDataOrRequest instanceof FormData
      ? formDataOrRequest
      : await formDataOrRequest.clone().formData()
  );
}
