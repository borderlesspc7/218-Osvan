import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Função HTTP para receber upload do A1 e criar job
export const createJob = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { cnpjId, cnpj, task, certData, notifyEmails } = data;
  const userId = context.auth.uid;

  try {
    // Validar dados
    if (!cnpjId || !cnpj || !task || !certData) {
      throw new functions.https.HttpsError('invalid-argument', 'Dados obrigatórios não fornecidos');
    }

    // Verificar se o CNPJ pertence ao usuário
    const cnpjDoc = await db.collection('cnpjs').doc(cnpjId).get();
    if (!cnpjDoc.exists || cnpjDoc.data()?.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'CNPJ não encontrado ou não pertence ao usuário');
    }

    // Criar job no Firestore
    const jobData = {
      cnpjId,
      cnpj,
      task,
      status: 'queued',
      outputs: {},
      error: null,
      createdBy: userId,
      createdAt: Date.now(),
      certData: certData, // Base64 do certificado
      certEnc: true,
      notifyEmails: notifyEmails || [],
    };

    const jobRef = await db.collection('jobs').add(jobData);

    // Retornar ID do job criado
    return { jobId: jobRef.id };

  } catch (error) {
    console.error('Erro ao criar job:', error);
    throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
  }
});

// Função para processar jobs na fila (será chamada pelo worker)
export const processJob = functions.https.onCall(async (data, context) => {
  // Verificar se é um worker autenticado
  if (!context.auth || !context.auth.token.worker) {
    throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
  }

  const { jobId } = data;

  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Job não encontrado');
    }

    const job = jobDoc.data();
    if (job?.status !== 'queued') {
      throw new functions.https.HttpsError('failed-precondition', 'Job não está na fila');
    }

    // Atualizar status para running
    await jobDoc.ref.update({ status: 'running' });

    // Aqui o worker RPA/Playwright faria o processamento
    // Por enquanto, apenas simular
    console.log(`Processando job ${jobId} para CNPJ ${job?.cnpj}`);

    return { success: true };

  } catch (error) {
    console.error('Erro ao processar job:', error);
    throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
  }
});

// Função para atualizar status do job (chamada pelo worker)
export const updateJobStatus = functions.https.onCall(async (data, context) => {
  // Verificar se é um worker autenticado
  if (!context.auth || !context.auth.token.worker) {
    throw new functions.https.HttpsError('permission-denied', 'Acesso negado');
  }

  const { jobId, status, outputs, error } = data;

  try {
    const jobRef = db.collection('jobs').doc(jobId);
    const updateData: any = { status };

    if (outputs) updateData.outputs = outputs;
    if (error) updateData.error = error;

    await jobRef.update(updateData);

    return { success: true };

  } catch (error) {
    console.error('Erro ao atualizar job:', error);
    throw new functions.https.HttpsError('internal', 'Erro interno do servidor');
  }
});
